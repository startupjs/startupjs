import { Provider } from './Provider';
import { Template } from './Template';

export interface MailSettings {
  providers: Provider[];
  templates: Template[];
  default: {
    provider: Provider;
    template: Template;
  };
  overwrite?: {
    templates: Template[];
  };
}
