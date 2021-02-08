import { Provider } from '../../src'
import { ProviderResponse } from '../../src/Provider'

export class Provider2 implements Provider {
  getName (): string {
    return this.constructor.name
  }

  async send (settings: {
    from: string
    to: string | string[]
    cc?: string | undefined
    bcc?: string | undefined
    subject: string
    inline?: NodeJS.ReadableStream | NodeJS.ReadableStream[] | undefined
    attachment?: NodeJS.ReadableStream | NodeJS.ReadableStream[] | undefined
    tls?: boolean | undefined
    template: { text: string, context: { [key: string]: any } }
  }): Promise<ProviderResponse> {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (settings?.template?.context !== undefined) {
          resolve({
            ...settings.template,
            result: {
              status: 'success',
              payload: { Provider2: true }
            }
          })
        } else {
          reject(
            new Error("Template text or Template context wasn't received.")
          )
        }
      }, 1000)
    })
  }
}
