export interface SendSettings {
  from: string
  to: string
  cc?: string
  bcc?: string
  subject: string
  inline?: NodeJS.ReadableStream[] | NodeJS.ReadableStream
  attachment?: NodeJS.ReadableStream[] | NodeJS.ReadableStream
  tls?: boolean
  provider?: string
  template?: string
}

export type Send = (settings: SendSettings) => Promise<void>
