# startupjs 2fa-totp-authentication
> Сomponent of two-factor authentication

## Installation

```sh
yarn add @startupjs/2fa-totp-authentication
```

## Connecting to the startupjs

### server

In `server/index.js` add next strings:
```js
import { init2fa } from '@startupjs/2fa-totp-authentication/server'
import app from '../app.json'
```

In `startupjsServer` function add:
```js
init2fa(ee, { appName: app.expo.name })
```

### client

```js
import { createSecret, getSecret, QRSecret, CheckToken } from '@startupjs/2fa-totp-authentication'

export default function MyComponent() {
  const [secret, setSecret] = useState({})

  async function onCreateSecret () {
    const secret = await createSecret()
    setSecret(secret)
  }

  async function onGetSecret () {
    try {
      const secret = await getSecret()
      secret && setSecret(secret)
    } catch (err) {
      console.log('err: ', err)
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <Button
          style={styles.button}
          title="Create secret"
          onPress={onCreateSecret}
        />
        <Button
          style={styles.button}
          title="Get created secret"
          onPress={onGetSecret}
        />
      </View>
      {secret.QRDataURL && <QRSecret style={styles.qr} />}
      {secret.QRDataURL && <CheckToken onSuccess={() => alert('Right code')} onDismiss={() => alert('Wrong code')} />}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center'
  },
  row: {
    minWidth: 320,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  qr: {
    width: 100,
    height: 100
  }
})
```

## functions

- `createSecret` - returns a `Promise` which creates a request to create a `Secret` (if secret exists it will be replaced by new secret) and returns the result:
  - `{ base32, QRDataURL }` here:
    - `base32` - your Secret code
    - `QRDataURL` - QR code that you can use like image

- `checkToken(token)` - return `true` if token is valid and `false` otherwise

- `getSecret` - return already created secret (if secret does not exist there will throw error) in format like in `createSecret`.

## components

### QRSecret
  You can use this component for show QR code of existing secret. If secret does not exist there will show nothing.

### CheckToken
  Simple token validation. There are props:
- `style` - styles of root component
- `label` - input label
- `onSuccess` - valid token callback
- `onDismiss` - invalid token callback
