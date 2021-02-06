import fs from 'fs'
import _template from 'lodash.template'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)

export class Template {
  templates: Template[]
  dirname: string
  ext: string
  constructor (
    templates: Template[] = [],
    dirname: string = __dirname,
    ext = 'html'
  ) {
    this.templates = templates
    this.dirname = dirname
    this.ext = ext
  }

  getName (): string {
    return this.constructor.name
  }

  async getTemplateBody (): Promise<string> {
    const template = await readFile(
      `${this.dirname}/${this.getName()}.${this.ext}`,
      {
        encoding: 'utf-8'
      }
    )

    const text: { [key: string]: string } = {}

    await Promise.all(
      this.templates.map(async template => {
        text[template.getName()] = await template.getTemplateBody()
      })
    )

    return _template(template)(text)
  }

  async getData (): Promise<{ [key: string]: any }> {
    return await Promise.resolve({})
  }

  async composeData (context: { [key: string]: any } = {}): Promise<{ [key: string]: any }> {
    if (context[this.getName()] === undefined) {
      context[this.getName()] = await this.getData()
    }

    await Promise.all(
      this.templates.map(async template => {
        if (context[template.getName()] === undefined) {
          context[template.getName()] = await template.getData()
        }
      })
    )

    return context
  }
}
