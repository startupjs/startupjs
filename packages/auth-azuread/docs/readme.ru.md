# Azure AD

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Требования
```
@startupjs/auth: >= 0.33.0
react-native-webview: 10.10.2
```

## Настройка приложения
1 - Перейти на [Microsoft Azure portal](https://portal.azure.com/)
2 - Создать аккаунт, если его нет
3 - Перейти в **Active Directory**
4 - Перейти на вкладку [Регистрация приложений](https://portal.azure.com/?l=en.en-us#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)
5 - Далее **Новая регистрация**, нужно заполнить поля
6 - Скопировать **Идентификатор приложения** как `AZUREAD_CLIENT_ID`, в config.json
7 - Скопировать **Идентификатор каталога** как `AZUREAD_TENTANT_ID`, в config.json
8 - Перейти во вкладку **Конечные точки**, скопировать **Документ метаданных OpenID Connect** как `AZUREAD_IDENTITY_METADATA` в config.json. Вместо common/organizations должен стоять **Идентификатор каталога**.
9 - Во вкладке **Сертификаты и секреты**, создать секрет клиента, скопировать как `AZUREAD_CLIENT_SECRET` в config.json.
10 - Далее нужно настроить URI перенаправления, для этого нужно перейти во вкладку с настройкой URI перенаправления. Создать платформы с ссылками:
SPA платформа - `http://localhost:3000/auth/azuread/callback`
Web платформа - `http://localhost:3000/auth/azuread/callback-native`
11 - В манифесте указать данные:
  "oauth2AllowIdTokenImplicitFlow": true,
  "oauth2AllowImplicitFlow": true

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as AzureadStrategy } from '@startupjs/auth-azuread/server'
```

Импорт либы для конфига:
```js
import conf from 'nconf'
```

В startupjsServer, в стратегии функции initAuth нужно добавить AzureadStrategy, с переменными из конфига:
```js
initAuth(ee, {
  strategies: [
    new AzureADStrategy({
      clientId: conf.get('AZUREAD_CLIENT_ID'),
      clientSecret: conf.get('AZUREAD_CLIENT_SECRET'),
      tentantId: conf.get('AZUREAD_TENTANT_ID'),
      identityMetadata: conf.get('AZUREAD_IDENTITY_METADATA'),
      allowHttpForRedirectUrl: process.env.NODE_ENV !== 'production'
    })
  ]
})
```
Параметр `allowHttpForRedirectUrl` - определяет возможность использования `http` для `redirect url`
Для продакшена нужно использовать https в BASE_URL, и условие `process.env.NODE_ENV !== 'production'`

## Инициализация в верстке
```js
import { AuthButton as AzureadAuthButton } from '@startupjs/auth-azuread/client'
```
