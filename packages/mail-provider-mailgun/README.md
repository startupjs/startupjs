# Mail service

## Installation

```sh
yarn add @startupjs/mail
```

or

```sh
npm i @startupjs/mail
```

## Configuration

### Add module to be force compiled by webpack

```
  // webpack.server.config.js
  const getConfig = require('startupjs/bundler.cjs').webpackServerConfig

  module.exports = getConfig(undefined, {
    forceCompileModules: [
      "@startupjs/mail"
    ],
    alias: {}
  })
```

### Init mail service:

  ```
  import initMail from '@startupjs/mail/server'

  ...

  startupjsServer({
    // ...
  }, (ee, options) => {
    initMail(ee, {
      defaultProvider: 'mailgun',
      providers: {
        mailgun: {
          apiKey: 'registered key for mailgun-js',
          domain: 'registered domain for mailgun-js'
        }
      }
    })
  })
  ```

  ### Init mail parameters:

  - defaultProvider - name of provider would be used by default
  - providers - object with config for all mail providers (for now only mailgun implemented)

## Usage



### As a function (on the backend side)

```sh
  import { sendEmail } from '@startupjs/mail/server'

  ...
  sendEmail(model, options)
  ...
```

### As a function (on the frontent side)

```sh
  import { sendEmail } from '@startupjs/mail'

  ...
  sendEmail(options)
  ...
```

On the server side you can use your own instance of mail client, just pass it as second parameter or leave it empty to use client that initialized before

### sendEmail function options (both for server and client)
- ignoreWhitelist - disable/enable e-mail restrictions in DEV stage
- from - the sender's e-mail (you can also place it in config.json using the key 'MAILGUN_FROM_ID'),
- to - comma separated string with recipient emails 'mail1@mail.com, mail2@mail.com' or array of emails,
- subject - email subject,
- text - email content,
  or
- html - email content as an HTML temlate
- template - name of your template constructor
- templateOptions - options that will be passed into template constructor
- inline - inline image for html content (path to image)


```sh
  const filepath = path.join(__dirname, 'test.jpg')
  const options = {
    html: '<html>Inline image here:<img src="cid:test.jpg"></html>',
    inline: filepath
    //...other options
  }
```


#### Tamplates

You can use the constructor tamplate, for this need to create folder in root directory with the name 'emails' and creating in it your templates. Eacth template must be a constructor function that returns object with
html, subject fields.

### Template example

```
// client
  sendEmail({
    ...
    template: 'Example',
    templateOptions: { text: 'Hello World!' }
  })
...

// template
  export default function Example (options) {
    return { html: `<p>${options.text}</p>`, subject: 'Some subject' }
  }
```


// Note The maximum number of recipients allowed for Batch Sending is 1,000.
// Note Recipient variables should be set as a valid JSON-encoded dictionary, where key is a plain recipient // address and value is a dictionary with variables.
