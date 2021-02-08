import express from 'express'
import { Mail } from './Mail'
import { MailSettings } from './MailSettings'
import { ProviderResponse } from './Provider'
import { SendSettings } from './Send'

// TODO Реализовать всю логику которую требует StartupJS.

export class MailStartupJS {
  private readonly mail: Mail
  constructor (
    settings: MailSettings,
    expressApplication: express.Application,
    apiRootPath: string
  ) {
    this.mail = new Mail(settings)

    console.log({ expressApplication, apiRootPath })
  }

  async send (settings: SendSettings): Promise<ProviderResponse> {
    return await this.mail.send(settings)
  }
}
