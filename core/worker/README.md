# @startupjs/worker

Надежный воркер на базе BullMQ с автостартом по умолчанию. Поддерживает:
- загрузку джобов из папки `workerJobs/`
- регистрацию джобов из плагинов через хук `workerJobs`
- отдельный процесс/worker threads

## Установка
```bash
npm i @startupjs/worker
```

## Подключение (автостарт по умолчанию)
Просто добавьте плагин в `startupjs.config.js`:
```javascript
export default {
  plugins: [
    'worker' // автостарт включен по умолчанию
  ]
}
```

Отключить автостарт:
```javascript
export default {
  plugins: [
    {
      'worker': {
        server: { autoStart: false }
      }
    }
  ]
}
```
Или через env:
```bash
AUTO_START=false
```

## Где хранить джобы (вариант 1 — файлы)
Создайте папку `workerJobs/` в корне проекта. Каждый файл — отдельная джоба.
Пример: `workerJobs/sendDigest.js`
```javascript
export default async function action (jobData) {
  // Ваша логика
}

export const cron = {
  pattern: '0 * * * *', // раз в час
  jobData: { foo: 'bar' }
}
```
- `default export` — handler
- `cron.pattern` — расписание в crontab-формате
- `cron.jobData` — данные, которые попадут в `job.data`

## Регистрация джобов из плагинов (вариант 2 — хук)
Плагины могут отдавать джобы через хук `workerJobs`.
Пример `workerJobs.plugin.js`:
```javascript
export default {
  workerJobs () {
    return {
      myPluginJob: {
        enabled: true,
        schedule: '*/5 * * * *', // каждые 5 минут
        description: 'My plugin job',
        timeout: 30000,
        retryCount: 1,
        jobData: { hello: 'world' },
        async handler (jobData) {
          // Ваша логика
        }
      }
    }
  }
}
```

## Отдельный процесс / worker threads
- Отдельный процесс:
```bash
USE_SEPARATE_PROCESS=true
```
- Worker Threads (только если отдельный процесс включен):
```bash
USE_WORKER_THREADS=true
```

## Полезные env-переменные
- `AUTO_START` — автостарт воркера (по умолчанию `true`)
- `CONCURRENCY` — параллелизм выполнения
- `JOB_TIMEOUT` — таймаут джобы (мс)
- `QUEUE_NAME` — имя очереди (если требуется несколько очередей)
- `USE_SEPARATE_PROCESS` — запуск в отдельном процессе
- `USE_WORKER_THREADS` — включить worker threads (при отдельном процессе)

## Минимальный рабочий пример
1) Подключите плагин:
```javascript
export default {
  plugins: ['worker']
}
```
2) Создайте файл `workerJobs/ping.js`:
```javascript
export default async function action () {
  console.log('[worker] ping!')
}

export const cron = { pattern: '*/1 * * * *' } // каждую минуту
```
3) Запустите сервер — воркер стартует автоматически и начнет выполнять джобы.

---
Вопросы/проблемы: проверьте наличие папки `workerJobs/`, корректность cron-паттернов и доступность Redis.
