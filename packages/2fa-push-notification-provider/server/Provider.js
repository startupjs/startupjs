import { Provider } from '@startupjs/2fa-manager/Provider/index.js'
import { sendNotification } from '@startupjs/push-notifications/server/helpers/index.js'

export default class PushProvider extends Provider {
  constructor (ee, options) {
    super('push')

    this.codeMaxAge = options.codeMaxAge || 30 * 1000
  }

  async send (model, session) {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString()
    const userId = session.userId

    const $2fas = model.query('2fa', { userId, $limit: 1 })
    await $2fas.subscribe()

    const [twoFa] = $2fas.get()

    if (twoFa) {
      const $2fa = model.scope(`2fa.${twoFa.id}`)
      $2fa.set('push', {
        code: randomCode,
        createdAt: Date.now()
      })
    } else {
      await model.add('2fa', {
        push: {
          code: randomCode,
          createdAt: Date.now()
        },
        userId
      })
    }

    await sendNotification([userId], {
      title: 'Code',
      body: `Your code is ${randomCode}`
    })

    $2fas.unsubscribe()
  }

  async check (model, session, token) {
    const userId = session.userId

    const $2fas = model.query('2fa', {
      userId,
      'push.code': token,
      'push.createdAt': { $gte: Date.now() - this.codeMaxAge },
      $limit: 1
    })
    await $2fas.subscribe()
    const [twoFa] = $2fas.get()
    const isExist = !!twoFa

    if (isExist) await model.scope(`2fa.${twoFa.id}`).del('push')

    $2fas.unsubscribe()
    return isExist
  }
}
