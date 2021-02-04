import { Provider } from '../../src';

export class Provider3 implements Provider {
  getName(): string {
    return this.constructor.name;
  }
  send(settings: {
    from: string;
    to: string;
    cc?: string | undefined;
    bcc?: string | undefined;
    subject: string;
    inline?: NodeJS.ReadableStream | NodeJS.ReadableStream[] | undefined;
    attachment?: NodeJS.ReadableStream | NodeJS.ReadableStream[] | undefined;
    tls?: boolean | undefined;
    template: { text: string; context: { [key: string]: any } };
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          settings.template &&
          settings.template.text &&
          settings.template.context
        ) {
          resolve(settings);
        } else {
          reject(
            new Error("Template text or Template context wasn't received.")
          );
        }
      }, 1000);
    });
  }
}
