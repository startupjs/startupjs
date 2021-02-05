import { Template } from '../../src';
import { Template4 } from './Template4';

export class Template3 extends Template {
  constructor() {
    super([new Template4()], __dirname);
  }
  getData(): Promise<{ [key: string]: any }> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          user: 'Lena',
        });
      }, 100);
    });
  }
}
