export interface ProviderResponse {
  text: string
  context: { [key: string]: any }
  result: {
    status: 'success' | 'failure'
    payload: any
  }
}

export interface Provider {
  getName: () => string
  send: (settings: {
    from: string
    to: string | string[]
    cc?: string
    bcc?: string
    subject: string
    inline?: NodeJS.ReadWriteStream[] | NodeJS.ReadWriteStream
    attachment?: NodeJS.ReadWriteStream[] | NodeJS.ReadWriteStream
    template: {
      text: string
      context: { [key: string]: any }
    }
  }) => Promise<ProviderResponse>
}
