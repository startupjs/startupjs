import { Template } from '../../src'

export class Template4 extends Template {
  constructor () {
    super([], __dirname)
  }

  async getData (): Promise<{ [key: string]: any }> {
    return await new Promise(resolve => {
      setTimeout(() => {
        resolve({
          user: 'Lada'
        })
      }, 150)
    })
  }
}
