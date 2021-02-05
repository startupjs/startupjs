import { Template } from '../../src';
import { Template3 } from './Template3';

export class Template2 extends Template {
  constructor() {
    super([new Template3()], __dirname);
  }
  getData(): Promise<{ [key: string]: any }> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          user: 'Oleg',
        });
      }, 200);
    });
  }
}
