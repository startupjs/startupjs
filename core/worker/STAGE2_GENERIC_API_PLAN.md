# Stage 2: generic API для `@startupjs/worker`

## Контекст

`@startupjs/worker@0.62.2` уже содержит первый BullMQ-based public API:

- `runJob(name, data, options)` сохранил старый blocking contract: поставить job
  и дождаться результата.
- `enqueueJob(name, data, options)` ставит job и сразу возвращает serializable
  `jobRef`.
- `waitJob(jobRef)`, `getJobStatus(jobRef)`, `queryJobs()`,
  `getJobsCount()`, `cancelJob()` уже есть.
- `trackingKey`, `delay`, `startAt`, runtime `worker`, basic `singleton`,
  `debounce`, leading `throttle` уже есть.

Следующий шаг должен оставаться generic и additive. LMS нужен этот слой для
временного legacy `tasks` bridge, но `@startupjs/worker` не должен знать про
LMS-specific `tasks`, `taskId`, `uniqId`, `refused` или Mongo read model.

Главная проблема: legacy bridge не может безопасно использовать BullMQ dedup
вслепую. Если enqueue вернул уже существующий job, отдельный legacy status doc
может остаться в ожидании навсегда, если вызывающий код не видит, что вызов
был deduped/skipped/throttled.

## Статус реализации

Реализовано в ветке `worker-stage2-generic-api`:

- lazy dashboard import в worker plugin;
- `enqueueJob(..., { returnMeta: true })`;
- duplicate metadata для singleton/debounce/throttle;
- duplicate policies `return-existing`, `skip`, `throw`;
- debounce policy `replace` по умолчанию;
- `throttle.trailing` как leading + latest-payload trailing job;
- lifecycle hooks `onQueued`, `onDeduped`, `onStarted`, `onProgress`,
  `onCompleted`, `onFailed` как managed best-effort события: они не меняют
  BullMQ outcome, но pending hook promises flush-ятся при shutdown;
- handler context `backend` / `createModel()`, включая reuse уже
  инициализированного StartupJS backend через `startupjs/server.getBackend()`;
- README и unit/integration coverage.

## Не цели

- Не добавлять collection `tasks`.
- Не добавлять LMS statuses (`new`, `executing`, `done`, `error`, `refused`) как
  worker package semantics.
- Не менять default behavior `runJob()`.
- Не менять default return shape `enqueueJob()`.
- Не добавлять patch-package patch в LMS для новой версии worker. Если нужен
  bugfix, он должен быть внесен и опубликован в `@startupjs/worker`.
- Не делать browser React hooks в этом PR. Status/query API уже есть; client
  hooks можно делать позже в package или app-layer.

## Порядок работ

### 1. Lazy imports в plugin

Файл:

- `core/worker/plugin.js`

Сейчас:

```js
import initDashboardRoute from './initDashboardRoute.js'
```

импортируется на top-level. Apps могут загрузить plugin во время server
bootstrap даже при выключенном dashboard и `autoStart: false`. Это слишком рано
тащит runtime/dashboard зависимости и уже вынудило LMS сделать локальный patch.
Правка должна жить upstream.

Что поменять:

- убрать top-level import `initDashboardRoute`;
- импортировать dashboard route динамически только внутри `serverRoutes()` и
  только когда `dashboard` truthy;
- оставить `initWorker` dynamic import за `shouldAutoStart`;
- не менять существующие options/defaults.

Тесты:

- import `@startupjs/worker/plugin` не импортирует `initDashboardRoute.js`;
- dashboard route все еще инициализируется, когда включен `dashboard`;
- `autoStart: false` не импортирует и не стартует `init.js`.

### 2. Structured enqueue result

Файлы:

- `core/worker/jobApi.js`
- `core/worker/jobOptions.js`
- `core/worker/jobRef.js`

Текущее поведение:

```js
const ref = await enqueueJob(name, data, options)
```

возвращает только `jobRef`.

Нужно добавить opt-in режим:

```js
const result = await enqueueJob(name, data, {
  ...options,
  returnMeta: true
})
```

Форма для созданного job:

```js
{
  ref,
  created: true,
  deduped: false,
  skipped: false,
  reason: null,
  policy: 'created',
  duplicateOf: null
}
```

Форма для duplicate/dedup:

```js
{
  ref: existingRef,
  created: false,
  deduped: true,
  skipped: false,
  reason: 'singleton' | 'debounce' | 'throttle',
  policy: 'return-existing',
  duplicateOf: existingRef
}
```

Правило совместимости:

- без `returnMeta` `enqueueJob()` возвращает ровно текущий `jobRef`;
- `runJob()` продолжает идти через простой `jobRef` path.

Техническая деталь:

BullMQ не возвращает флаг `created`. Для opt-in `returnMeta` path надо
генерировать internal candidate `jobId`, если caller не передал custom
`jobOptions.jobId`.

Flow:

1. `buildEnqueueConfig()` дополнительно возвращает metadata:

```js
{
  deduplication: {
    id,
    reason: 'singleton' | 'debounce' | 'throttle',
    policy
  }
}
```

2. `enqueueJobInternal()` ставит `jobOptions.jobId = candidateJobId` только для
   `returnMeta` вызовов, где нужно надежно определить dedup.
3. `queue.add()` возвращает `job`.
4. Если `job.id !== candidateJobId`, BullMQ вернул уже существующий deduped job.

Про custom `jobOptions.jobId`:

- не менять custom job id semantics;
- если user передал `jobOptions.jobId`, `returnMeta` может надежно определить
  dedup только когда BullMQ вернул другой id;
- duplicate-by-jobId не является worker duplicate policy, это low-level BullMQ
  behavior. Его нужно задокументировать отдельно.

Тесты:

- старый `enqueueJob()` return shape не изменился;
- `enqueueJob(..., { returnMeta: true })` возвращает `{ created: true }`;
- singleton duplicate возвращает `{ created: false, deduped: true }`;
- `runJob()` все еще возвращает handler result.

### 3. Duplicate policy

Файлы:

- `core/worker/jobOptions.js`
- `core/worker/jobApi.js`

Target API:

```js
await enqueueJob('syncUser', data, {
  singleton: {
    key: data.userId,
    onDuplicate: 'return-existing'
  }
})
```

Policies:

- `return-existing`: default, сохранить текущее поведение, вернуть existing
  `jobRef`;
- `skip`: duplicate не считается новой execution; с `returnMeta` вернуть
  `{ skipped: true, reason }`; без `returnMeta` вернуть existing `ref`, чтобы не
  ломать простых callers;
- `throw`: бросить `DuplicateJobError` с `.jobRef`, `.reason`, `.policy`.

Scope:

- поддержать policy для `singleton`, `debounce`, `throttle`;
- default должен сохранить текущее поведение;
- policy применяется после `queue.add()`, потому что именно BullMQ атомарно
  выбирает winner duplicate/dedup.

Тесты:

- default duplicate возвращает existing ref;
- `returnMeta + skip` возвращает skipped metadata;
- `throw` reject-ит controlled error с existing ref и reason.

### 4. Полный `throttle.trailing`

Файл:

- `core/worker/jobOptions.js`

До этой доработки:

```js
throttle: { key, ttl, trailing: true }
```

вызывал `throttle.trailing is not supported yet`.

Target API:

```js
await enqueueJob('recalculateStats', data, {
  throttle: {
    key: data.lessonId,
    ttl: 3000,
    trailing: true
  }
})
```

Семантика:

- первый вызов в окне сразу ставит leading job;
- вызовы внутри TTL не ставят новый leading job;
- если `trailing: true`, последний payload внутри TTL планируется как один
  delayed trailing job после оставшегося TTL;
- если до запуска trailing приходят новые вызовы, trailing payload заменяется
  последним payload;
- `returnMeta` сообщает, вызов создал leading execution, trailing execution или
  был skipped.

Дизайн реализации:

Добавить небольшой generic helper, вероятно:

- `core/worker/throttle.js`

Redis keys:

```txt
${queuePrefix}:worker:throttle:${worker}:${name}:${key}
${queuePrefix}:worker:throttle-trailing:${worker}:${name}:${key}
```

Flow для `throttle.trailing`:

1. Нормализовать `key` и `ttl` в `jobOptions.js`.
2. В `enqueueJobInternal()` до обычного `queue.add()` вызвать helper:

```js
const decision = await resolveThrottleWindow({ worker, name, key, ttl, trailing })
```

3. Если active window нет:
   - поставить lock key через `PX ttl NX`;
   - enqueue leading job без delay;
   - вернуть reason `null`.
4. Если active window есть и `trailing: false`:
   - не создавать новый job;
   - вернуть duplicate metadata, по возможности с current leading ref.
5. Если active window есть и `trailing: true`:
   - вычислить оставшийся TTL через `PTTL`;
   - enqueue delayed job:

```js
delay: remainingTtl
deduplication: {
  id: `throttle-trailing:${worker}:${name}:${key}`,
  ttl: remainingTtl,
  extend: true,
  replace: true
}
```

Так BullMQ delayed replace даст "last payload wins".

Важное отличие:

- leading throttle можно оставить на текущем BullMQ dedup path для совместимости;
- trailing throttle требует custom lock + delayed replace, потому что BullMQ
  dedup сам по себе не создает trailing job.

Тесты:

- `throttle.trailing` больше не throws;
- первый вызов запускается сразу;
- второй и третий вызовы внутри TTL схлопываются в один delayed trailing job;
- trailing job получает последний payload;
- `returnMeta` показывает leading/trailing/skipped outcomes.

### 5. Lifecycle hooks

Файлы:

- `core/worker/runtime.js`
- `core/worker/jobApi.js`
- `core/worker/processJob.js`
- `core/worker/init.js`

Target API в plugin/server options:

```js
plugins: {
  worker: {
    server: {
      events: {
        async onQueued (event) {},
        async onDeduped (event) {},
        async onStarted (event) {},
        async onProgress (event) {},
        async onCompleted (event) {},
        async onFailed (event) {}
      }
    }
  }
}
```

Event shape:

```js
{
  ref,
  name,
  worker,
  data,
  meta,
  state,
  reason,
  result,
  error,
  job
}
```

Реализация:

- добавить `events` в `getRuntimeOptions()`;
- добавить helper `emitWorkerEvent(name, payload, options)`;
- вызывать `onQueued` после успешного created enqueue;
- вызывать `onDeduped` после duplicate/dedup result;
- вызывать `onStarted`, `onProgress`, `onCompleted`, `onFailed` через BullMQ
  `Worker` events в родительском процессе, а не изнутри `processJob()`;
- `progress()` внутри handler только вызывает `job.updateProgress(value)`.

Почему не из `processJob()`:

- при `useSeparateProcess` job handler выполняется в child runner;
- функции из server config не являются serializable worker payload;
- parent-side BullMQ events дают одинаковую точку интеграции для same-process и
  separate-process режимов.

Failure policy:

- default: hook failures логируются и не меняют job outcome;
- lifecycle hooks подходят для eventually consistent read-model/status layer;
- BullMQ job state остается source of truth;
- shutdown ожидает уже запущенные hook promises перед закрытием runtime resources;
- optional future flag: `strictEvents: true` может фейлить job при ошибке hook.
  Не добавлять strict mode, пока нет конкретного caller-а.

Plugin hook alternative:

- если нужно дать другим StartupJS plugins подписываться без функций в config,
  можно дополнительно дергать `MODULE.asyncHook('workerJobQueued', event)` и
  аналогичные hook names;
- для первого implementation достаточно `server.events`.

Тесты:

- hooks вызываются в ожидаемом порядке для successful job;
- failed job вызывает `onStarted` и `onFailed`, но не `onCompleted`;
- progress hook получает progress payload;
- hook failure логируется и не фейлит job.

### 6. `backend/createModel` в job context

Файлы:

- `core/worker/runtime.js`
- `core/worker/processJob.js`
- возможно `core/server/index.js`

Текущий context:

```js
{
  log,
  job,
  jobRef,
  progress,
  enqueueJob,
  waitJob,
  getJobStatus
}
```

Target context:

```js
{
  backend,
  createModel
}
```

Минимальная реализация:

- сохранить backend, созданный `ensureBackendReady()`, внутри worker runtime;
- экспортировать `getWorkerBackend()` и `createWorkerModel()`;
- в `processJob()` добавить:

```js
const createModel = () => createWorkerModel()
```

Поведение:

- если `ensureBackend: true`, `createModel()` возвращает новый model от worker
  backend;
- caller сам отвечает за `model.close()`;
- если backend отключен или недоступен, `createModel()` throws понятную ошибку.

App-server auto-start case:

- если backend был инициализирован вне worker runtime, `ensureBackendReady()`
  берет его через `startupjs/server.getBackend()`;
- если backend отключен (`ensureBackend: false`) или реально не инициализирован,
  `createModel()` throws controlled error.

Тесты:

- handler context содержит `createModel`;
- при `ensureBackend: false` вызов `createModel()` throws controlled error;
- если feasible в integration, при `ensureBackend: true` создается model, и
  caller может его закрыть.

### 7. README/docs

Файл:

- `core/worker/README.md`

Документировать:

- `returnMeta`;
- duplicate policy;
- `throttle.trailing`;
- lifecycle events;
- `createModel`;
- явное правило: default `enqueueJob` и `runJob` behavior не изменились.

## Рекомендуемый порядок реализации

1. Lazy plugin import.
2. Structured enqueue result и duplicate policy.
3. Lifecycle hooks.
4. `backend/createModel` context.
5. `throttle.trailing`.
6. README update.
7. Полный unit + Redis integration test pass.

Так самый рискованный пункт (`throttle.trailing`) остается изолированным до
того момента, когда уже есть observable enqueue metadata.

## Проверки

Из repo root или `core/worker`:

```bash
cd core/worker
yarn test:unit
yarn test:integration
yarn test
```

Также запустить root lint/test для измененных файлов, если он доступен.

Для Redis integration tests использовать isolated `queuePrefix`, как уже
делают текущие тесты.

## Acceptance criteria

- LMS не нужен patch-package patch для `@startupjs/worker@0.62.x`.
- Existing public API остается backward compatible.
- `enqueueJob(..., { returnMeta: true })` отличает created от deduped.
- `throttle.trailing` работает как leading + last-payload trailing.
- Lifecycle hooks позволяют app строить временный read model без monkey-patch.
- Job handlers могут создать model через generic context API.
- Unit и Redis/BullMQ integration tests покрывают новое поведение.
