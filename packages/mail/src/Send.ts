export interface SendSettings {
  from: string
  to: string | string[]
  cc?: string
  bcc?: string
  subject: string
  inline?: NodeJS.ReadWriteStream[] | NodeJS.ReadWriteStream
  attachment?: NodeJS.ReadWriteStream[] | NodeJS.ReadWriteStream
  provider?: string
  template?: string
}

export type Send = (settings: SendSettings) => Promise<void>
