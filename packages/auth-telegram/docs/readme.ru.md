# Авторизация через Telegram 

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Требования
```
passport-telegram-official: >= 1.0.0
@startupjs/auth: >= 0.33.0
```

## Создание и настройка приложения
1 - Создать и настроить бота. Вы должны получить API токен [Telegram](https://core.telegram.org/)

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as TelegramStrategy } from '@startupjs/auth-telegram/server'
```

Импорт либы для конфига:
```js
import conf from 'nconf'
```

В startupjsServer, в стратегии функции initAuth нужно добавить TelegramStrategy, с переменными из конфига:
```js
initAuth(ee, {
    strategies: [
        new TelegramStrategy({
            botToken: conf.get('TELEGRAM_AUTH_BOT_TOKEN')
        })
    ]
})
```

## Мобильная авторизация
ЕЩЕ НЕ РЕАЛИЗОВАНА

## Инициализация в верстке
Можно использовать компонент
```js
import { AuthButton as TelegramAuthButton } from '@startupjs/auth-telegram/client'
```

а так же укажите название бота в клиентском конфиге (.env) в переменной TELEGRAM_LOGIN
