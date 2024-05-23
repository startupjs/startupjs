
# Authorization via Telegram

## Init main module
[Configuring main module](/docs/auth/main)

## Requirements
```
passport-telegram-official: >= 1.0.0
@startupjs/auth: >= 0.33.0
```

## Creating an app
1 - Create and configure a chat bot [Telegram](https://core.telegram.org/). 
You must get an API token

## Init on server
Importing strategy:
```js
import { Strategy as TelegramStrategy } from '@startupjs/auth-telegram/server'
```

Importing lib for config:
```js
import conf from 'nconf'
```

In startupjsServer, in the strategy of the initAuth function need to add TelegramStrategy:
```js
initAuth(ee, {
    strategies: [
        new TelegramStrategy({
            botToken: conf.get('TELEGRAM_AUTH_BOT_TOKEN')
        })
    ]
})
```

## Mobile authentication
Hasn't been implemented yet

## Init in layout
You can use component
```js
import { AuthButton as TelegramAuthButton } from '@startupjs/auth-telegram/client'
```

Define a clint environment variable (.env) TELEGRAM_LOGIN with a name of the bot
