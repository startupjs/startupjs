import { Provider } from '@startupjs/2fa-manager/Provider'
import { sendNotification } from '@startupjs/push-notifications/server/helpers'

export default class PushProvider extends Provider {
  constructor (ee, options) {
    super('push')
    this.init(ee, options)
  }

  async send (model, session) {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString()
    const userId = session.userId

    const $2fas = model.query('2fa', { userId })
    await $2fas.subscribe()

    const [twoFa] = $2fas.get()

    if (twoFa) {
      const $2fa = model.scope(`2fa.${twoFa.id}`)
      $2fa.set('push.code', randomCode)
    } else {
      await model.add('2fa', {
        push: {
          code: randomCode
        },
        userId
      })
    }

    sendNotification([userId], {
      title: 'Code',
      body: `Your code is ${randomCode}`
    })
  }

  async check (model, session, token) {
    const userId = session.userId

    const $2fas = model.query('2fa', { userId, $limit: 1 })
    await $2fas.subscribe()
    const [twoFa] = $2fas.get()

    if (!twoFa) return false

    const $2fa = model.scope('2fa.' + twoFa.id)
    const originalCode = $2fa.get('push.code')

    $2fas.unsubscribe()
    if (originalCode === token) {
      $2fa.del('push.code')
      $2fa.unsubscribe()
      return true
    } else {
      $2fa.unsubscribe()
      return false
    }
  }
}
