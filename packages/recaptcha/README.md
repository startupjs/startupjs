# @startupjs/recaptcha

library for displaying and interacting with [Google ReCaptcha](https://www.google.com/recaptcha/about/)

## Install

`yarn add @startupjs/recaptcha`

## Connecting to StartupJS

```js
  // Component
  import { Recaptcha } from '@startupjs/recaptcha'

  // Token verification function on the Google server
  import { checkToken } from '@startupjs/recaptcha/server'
```

### server

Add the following lines to `server/index.js`:
```js
  import initRecaptcha from '@startupjs/recaptcha/server'
```
Add to the `startupjsServer` function:
```js
  initRecaptcha(ee)
```
Add to the `getHead` function:
```js
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

#### `checkToken(token)`
A server function that accepts a token, verifies it on the Google server, and returns a boolean response

### config

You need to add to the `config.json` file of your project:
```js
  {
    "RECAPTCHA_SECRET_KEY": "YOUR_SECRET_KEY",
    "RECAPTCHA_SITE_KEY": "YOUR_SITE_KEY"
  }
```

## Example

### Use on server
```js
import { checkToken } from '@startupjs/recaptcha/server'

export default function initRoutes (router) {
  router.post('/api/auth', async function (req, res) {
    const { token, ...data } = req.body

    const isVerified = await checkToken(token)

    if (!isVerified) {
      return res.status(403).send(isVerified)
    }

    // ...
  })
}
```

### I'm not a robot
```js
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)

  const ref = useRef()

  const send = () => ref.current.open()

  const onVerify = token => {
    console.log('onVerify', token)
    setRecaptchaVerified(true)
  }

  return pug`
    Div.root
      Recaptcha(
        ref=ref
        id='normal-captcha'
        variant='normal'
        onVerify=onVerify
        onLoad=() => console.log('onLoad')
        onExpire=() => console.log('onExpire')
        onError=error => console.log('onError', error)
        onClose=() => console.log('onClose')
      )
      if recaptchaVerified
        Span.label The token is valid
      Button(
        onPress=send
        disabled=recaptchaVerified
      ) Check
  `
```

### Invisible
```js
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)

  const ref = useRef()

  const send = () => ref.current.open()

  const onVerify = token => {
    console.log('onVerify', token)
    setRecaptchaVerified(true)
  }

  return pug`
    Div.root
      Recaptcha(
        id='invisible-captcha'
        ref=ref
        onVerify=onVerify
        onLoad=() => console.log('onLoad')
        onExpire=() => console.log('onExpire')
        onError=error => console.log('onError', error)
        onClose=() => console.log('onClose')
      )
      if recaptchaVerified
        Span.label The token is valid
      Button(
        onPress=send
        disabled=recaptchaVerified
      ) Check
  `
```

## Props

 - `variant` [String] - The variant of the widget (`invisible`, `normal` or `compact`). Default: `invisible`
 - `theme` [String] - The color theme of the widget (`dark` or `light`). Default: `light`
 - `baseUrl` [String] - The URL (domain) configured in the reCAPTCHA setup. (ex. `http://my.domain.com`). Default: your `BASE_URL` from `@env`
 - `lang` [String] - [Language code](https://developers.google.com/recaptcha/docs/language). Default: `en`
 - `onLoad` [Function] - A callback function, executed when the reCAPTCHA is ready to use
 - `onVerify` [Function(token)] - A callback function, executed when the user submits a successful response. The recaptcha response token is passed to your callback
 - `onExpire` [Function] - A callback function, executed when the reCAPTCHA response expires and the user needs to re-verify
 - `onError` [Function(error)] - A callback function, executed when reCAPTCHA encounters an error (usually network connectivity) and cannot continue until connectivity is restored. If you specify a function here, you are responsible for informing the user that they should retry
 - `onClose` [Function] - (Experimental) A callback function, executed when the Modal is closed

## Advanced use

```js
  import { checkDataToken } from '@startupjs/recaptcha/server'
```

`checkDataToken (token)` is an extended function `checkToken (token)` that returns an object with the original Google API response
