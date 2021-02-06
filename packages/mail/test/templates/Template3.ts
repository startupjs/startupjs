import { Template } from '../../src'
import { Template4 } from './Template4'

export class Template3 extends Template {
  constructor () {
    super([new Template4()], __dirname)
  }

  async getData (): Promise<{ [key: string]: any }> {
    return await new Promise(resolve => {
      setTimeout(() => {
        resolve({
          user: 'Lena'
        })
      }, 100)
    })
  }
}
