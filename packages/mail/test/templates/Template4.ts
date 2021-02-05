import { Template } from '../../src';

export class Template4 extends Template {
  constructor() {
    super([], __dirname);
  }
  getData(): Promise<{ [key: string]: any }> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          user: 'Lada',
        });
      }, 150);
    });
  }
}
