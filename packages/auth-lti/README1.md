# Авторизация через LTI

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Требования

```
startupjs: *
@startupjs/auth: *
@startupjs/ui: *
prop-types *
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

В startupjsServer, в стратегии функции initAuth нужно добавить LTIStrategy с указанием обьекта опций:

```
initAuth(ee, {
  strategies: [
    new LTIStrategy(<options>)
  ]
})
```

Доступные опции

```
  callbackUrl: <string> - опционально, дефолтное значение: '/auth/lti/callback'
  dbSchools: <boolean> - опционально, дефолтное значение: false
  collectionName: <string> - опционально если dbSchools со значение false, дефолтное значение: 'authLTISchools'
  schools: <object> - опционально если dbSchools со значением true
```

Пример значения опции schools

```
{
    <school-name>: {
      consumerKey: <key>,
      consumerSecret: <secret>
    },
    ucdavis: {
      consumerKey: '12312k321l'
      consumerSecret: '312kjh3k12jh''
    },
    ....
}
```

Вы можете проинициализировать стратегию с предопределенными школами

```
{
  schools: <object>
}
```

или использовать школы из базы данных
```
{
  dbSchools: true
}
```

## Инициализация в верстке
Отсутствует

## Использование школ из базы данных

### Компонент для редактирования списка школ

Этот компонент предоставляет возможность добавлять новые школы и удалять ранее добавленные

```
import { List } from '@dmapper/auth-lti'
...
<List />

```

Компонент принимает следующие опции

```
collection: <string> - опционально, дефолтное значение: 'authLTISchools'
```

Если вы нуждаетесь в другом названии коллекции для хранения школ, то вы должны указать это соответсвующей опцией в стратегии и в компоненте:
```
initAuth(ee, {
  strategies: [
    new LTIStrategy({
      dbScools: true,
      collectionName: 'anotherName' <---
    })
  ]
})
```

```
import { List } from '@dmapper/auth-lti'
...
<List
  collection="anotherName" <---
/>

```

### Configuring third party LMSs

- [Canvas](https://docs.google.com/document/d/1ZbxnYOnnsIybzr2RXwenYi5f2QeXc35wrnclWAsBE3Y/edit?usp=sharing)
