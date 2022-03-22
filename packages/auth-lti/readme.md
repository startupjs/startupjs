# Авторизация через LTI

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Требования

```
@startupjs/auth: >= 0.33.0
```

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as LTIStrategy } from '@startupjs/auth-idg/server'
```

Импорт либы для конфига:
```js
import conf from 'nconf'
````

В startupjsServer, в стратегии функции initAuth нужно добавить LTIStrategy, с переменными из конфига:
```js
initAuth(ee, {
  strategies: [
    new LTIStrategy({
      schools: conf.get('LTI_SCHOOLS')
    })
  ]
})
```

## Инициализация в верстке
Отсутствует
