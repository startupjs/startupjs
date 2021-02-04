export interface Provider {
  getName(): string;
  send(settings: {
    from: string;
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    inline?: Array<NodeJS.ReadableStream> | NodeJS.ReadableStream;
    attachment?: Array<NodeJS.ReadableStream> | NodeJS.ReadableStream;
    tls?: boolean;
    template: {
      text: string;
      context: { [key: string]: any };
    };
  }): Promise<any>;
}
