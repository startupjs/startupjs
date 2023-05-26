import { useState } from 'react'
import { AuthForm, LogoutButton, onLogout } from '../'
import { AuthButton as GoogleAuthButton } from '@startupjs/auth-google'
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin/client'
import { LoginForm, RegisterForm, RecoverForm } from '@startupjs/auth-local'
import { Button } from '@startupjs/ui'

# Authorization

## Requirements

```
@react-native-cookies/cookies: >= 6.0.6
@startupjs/ui: >= 0.33.0
startupjs: >= 0.33.0
```

## Description

## Init on server
```js
import { initAuth } from '@startupjs/auth/server'
```

In the body of the **startup js Server** function, the module is initialized, and strategies are added to **strategies**, each with its own set of characteristics:
```js
initAuth(ee, {
  strategies: [
    new LocalStrategy({}),
    new FacebookStrategy({
      clientId: conf.get('FACEBOOK_CLIENT_ID'),
      clientSecret: conf.get('FACEBOOK_CLIENT_SECRET')
    })
  ]
})
```

## Micro frontend
[Test example](/auth/sign-in)
(apple and azure keys are hidden from public access and need to be added manually)

These are ready-made pages with forms that can be connected to the site

To use them, you need in the file Root/index.js (or where startupjs/app is used), init the micro frontend and put it in the App component

First, you need the initializer function, which accepts the necessary options:
```js
import { initAuthApp } from '@startupjs/auth'
```

Its main options are **socialButtons** and **localForms**, which collect the necessary components for a common form. Since it is not known in advance which strategies should be connected, you have to connect them yourself. There are buttons for almost every strategy, except for the local one, to see what components exist for **auth-local**, there is a separate description for this strategy (in fact, as for all others).

Import the necessary components:
```js
import { AuthButton as AzureadAuthButton } from '@startupjs/auth-azuread'
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin'
import { LoginForm, RegisterForm, RecoverForm } from '@startupjs/auth-local'
```

Everything is based on a local strategy. It has 3 standard forms: Authorization, Registration, Password Recovery. Inside the module, there is logic for switching between these forms.
Microfrontend has 3 mandatory routes for the local strategy: 'sign-in', 'sign-up' и 'recover', actually, when using a local form, you always need to install components with forms using these keys.

```jsx
const auth = initAuthApp({
  localForms: {
    'sign-in': <LoginForm />,
    'sign-up': <RegisterForm />,
    'recover': <RecoverForm />
  },
  socialButtons: [
    <AzureadAuthButton />,
    <LinkedinAuthButton />
  ]
})
```

When the microfrontend is generated, you just need to pass it to the App
```pug
App(apps={ auth, main })
```

And also add routes for the server
```js
import { getAuthRoutes } from '@startupjs/auth/isomorphic'
//...
appRoutes: [
  ...getAuthRoutes()
]
//...
```

### Microfrontend customization
You can change the `Layout`. For example, the site has its own header, logo, background, etc.
To do this, you can throw a custom Layout in the microfrontend options:

```jsx
const auth = initAuthApp({
  Layout,
  localForms: {
    'sign-in': <LoginForm />,
    'sign-up': <RegisterForm />,
    'recover': <RecoverForm />
  }
})
```

Since jsx is thrown in **localForms** and **socialButtons**, all components can be modified as usual:
```jsx
const auth = initAuthApp({
  Layout,
  localForms: {
    'sign-in': <LoginForm
      properties={{
        age: {
          input: 'number',
          label: 'Age',
          placeholder: 'Enter your age'
        }
      }}
      validateSchema={{
        age: Joi.string().required().messages({
          'any.required': 'Fill in the field',
          'string.empty': 'Fill in the field'
        })
      }}
    />,
    'sign-up': <RegisterForm />,
    'recover': <RecoverForm />
  },
  socialButtons: [
    <GoogleAuthButton
      label='Sign in with Google'
    />,
    <FacebookAuthButton
      label='Sign in with Facebook'
    />
  ]
})
```

More information about customizing these components is described on the pages with the necessary strategies

If you need to change the standard headers and make your own markup, you can use the **renderForm** function:
```jsx
const auth = initAuthApp({
  Layout,
  localForms: {
    'sign-in': <LoginForm />,
    'sign-up': <RegisterForm />,
    'recover': <RecoverForm />
  },
  socialButtons: [
    <GoogleAuthButton />,
    <FacebookAuthButton />
  ],
  renderForm: function ({
    slide,
    socialButtons,
    localActiveForm,
    onChangeSlide
  }) {
    return pug`
      Div
        H5= getCaptionForm(slide)
        = socialButtons
        Div(style={ marginTop: 16 })
          = localActiveForm
    `
  }
})
```

It gets the forms that are declared, and the current slide

## Common component
General form with the necessary types of authorization
Everything is the same as for the microfrontend, but there are no routes, and you need to configure the slide switching yourself

```js
import { AuthForm } from '@startupjs/auth'
```

```jsx example
const [slide, setSlide] = useState('sign-in')

return (
  <AuthForm
    slide={slide}
    localForms={{
      'sign-in': <LoginForm />,
      'sign-up': <RegisterForm />,
      'recover': <RecoverForm />
    }}
    socialButtons={[
      <GoogleAuthButton label='Sign in with Google' />,
      <LinkedinAuthButton />
    ]}
    onChangeSlide={slide=> setSlide(slide)}
  />
)
```

## Helpers and server hooks

### Exit button
```jsx
import { LogoutButton } from '@startupjs/auth'
...
return <LogoutButton />
```

### Exit helper
```jsx
import { onLogout } from '@startupjs/auth'
...
return <Button onPress={onLogout}>Выйти</Button>
```

### onBeforeLoginHook
Helper-middleware, called before authorization

```jsx
initAuth(ee, {
  // ...
  onBeforeLoginHook: ({ userId }, req, res, next) => {
    console.log('onBeforeLoginHook')
    next()
  },
  // ...
}
```

### onAfterUserCreationHook
Helper-middleware, called after the user is created

```jsx
initAuth(ee, {
  // ...
  onAfterUserCreationHook: ({ userId }, req) => {
    console.log('onAfterUserCreationHook')
  },
  // ...
}
```

### onAfterLoginHook
Helper-middleware, called after authorization

```jsx
initAuth(ee, {
  // ...
  onAfterLoginHook: ({ userId }, req) => {
    console.log('onAfterLoginHook')
  },
  // ...
}
```

### onBeforeLogoutHook
Helper-middleware, called before exiting

```jsx
initAuth(ee, {
  // ...
  onBeforeLogoutHook: (req, res, next) => {
    console.log('onBeforeLogoutHook')
    next()
  },
  // ...
}
```

## Redirect after authorization
To set up a redirect, you need to throw the redirectUrl prop in initAuthApp, either for AuthForm, or for a separate button or form, for example:
`<GoogleAuthButton redirectUrl='/profile/google' />`
`<LoginForm redirectUrl='/profile/local' />`

The redirect works through cookies, and if you put something in a cookie named redirectUrl before authorization, then a redirect to value from the cookie will occur after it:

```js
  import { CookieManager } from '@startupjs/auth'

  CookieManager.set({
    baseUrl,
    name: 'authRedirectUrl',
    value: redirectUrl,
    expires: moment().add(5, 'minutes')
  })
```

You can also override the redirect on the server (for example, in the onBeforeLoginHook hook):

```js
  onBeforeLoginHook: ({ userId }, req, res, next) => {
    // req.cookies.authRedirectUrl = '/custom-redirect-path'
    next()
  }
```
