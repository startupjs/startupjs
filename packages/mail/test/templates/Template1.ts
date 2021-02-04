import { Template } from '../../src';
import { Template2 } from './Template2';
import { Template3 } from './Template3';
import { Template4 } from './Template4';

export class Template1 extends Template {
  constructor() {
    super([new Template2(), new Template4(), new Template3()], __dirname);
  }
  getData(): Promise<{ [key: string]: any }> {
    return new Promise(resolve => {
      setTimeout(async () => {
        resolve({
          user: 'Dmitriy',
        });
      }, 50);
    });
  }
}
