import express from 'express';
import { MailSettings } from './MailSettings';
import { MailStartupJS } from './MailStartupJS';
import { SendSettings } from './Send';

export { Mail } from './Mail';
export { MailSettings } from './MailSettings';
export { MailStartupJS } from './MailStartupJS';
export { Provider } from './Provider';
export { Send, SendSettings } from './Send';
export { Template } from './Template';

let mail: MailStartupJS | null = null;

export const initMail = (
  settings: MailSettings,
  expressApplication: express.Application,
  apiRootPath: string,
  reInit = false
): void => {
  if (!mail || reInit) {
    mail = new MailStartupJS(settings, expressApplication, apiRootPath);
  }
};

export const sendEmail = async (settings: SendSettings): Promise<void> => {
  if (mail) {
    await mail.send(settings);
  } else {
    throw new Error('[@startupjs/mail] mail service should be init first.');
  }
};
