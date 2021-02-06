import { Template } from '../../src'
import { Template3 } from './Template3'

export class Template2 extends Template {
  constructor () {
    super([new Template3()], __dirname)
  }

  async getData (): Promise<{ [key: string]: any }> {
    return await new Promise(resolve => {
      setTimeout(() => {
        resolve({
          user: 'Oleg'
        })
      }, 200)
    })
  }
}
