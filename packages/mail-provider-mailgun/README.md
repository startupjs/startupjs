# Mailgun mail provider

## Installation

```sh
yarn add @startupjs/mail-provider-mailgun
```

or

```sh
npm i @startupjs/mail-provider-mailgun
```

## Usage

```js
import MailgunProvider from '@dmapper/mail-provider-mailgun'

// Object with data according to mailgunjs official documentation:
// https://www.npmjs.com/package/mailgun.js
const data = {/*...*/}

// Initializing provider instance
const instance = new MailgunProvider({
          apiKey: 'registered key for mailgun-js',
          domain: 'registered domain for mailgun-js'
        })

// Sending emails
instance.send(data)
```
