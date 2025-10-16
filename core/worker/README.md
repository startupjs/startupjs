# @startupjs/worker

Worker на базе BullMQ с автостартом по умолчанию.

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
