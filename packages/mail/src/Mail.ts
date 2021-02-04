import { MailSettings } from './MailSettings';
import { Provider } from './Provider';
import { SendSettings } from './Send';
import { Template } from './Template';

export class Mail {
  private mailSettings: MailSettings;
  constructor(mailSettings: MailSettings) {
    this.mailSettings = mailSettings;

    this.send = this.send.bind(this);
  }

  async send(settings: SendSettings): Promise<any> {
    const availableProviders = this.mailSettings.providers;
    let availableTemplates = this.mailSettings.templates;
    const defaultProviderName = this.mailSettings.default.provider;
    const defaultTemplateName = this.mailSettings.default.template;
    const redefinedTemplates = this.mailSettings.overwrite?.templates || [];

    const targetProviderName =
      settings?.provider || defaultProviderName.getName();
    const targetTemplateName =
      settings?.template || defaultTemplateName.getName();

    let provider: Provider | undefined;
    let template: Template | undefined;

    provider = availableProviders.find(
      availableProvider => availableProvider.getName() === targetProviderName
    );

    if (!provider) {
      throw new Error(
        `[@startupjs/mail] provider: ${targetProviderName} not found.`
      );
    }

    if (Array.isArray(redefinedTemplates) && redefinedTemplates.length > 0) {
      availableTemplates = availableTemplates.map(template => {
        const overwriteTemplate = redefinedTemplates.find(
          item => item.getName() === template.getName()
        );

        if (overwriteTemplate) {
          return overwriteTemplate;
        }

        return template;
      });
    }

    if (availableTemplates.length === 0) {
      throw new Error('[@startupjs/mail] template list is empty.');
    }

    template = availableTemplates.find(
      template => template.getName() === targetTemplateName
    );

    if (!template) {
      throw new Error(
        `[@startupjs/mail] template: ${targetTemplateName} not found.`
      );
    }

    return await provider.send({
      from: settings.from,
      to: settings.to,
      cc: settings.cc,
      bcc: settings.bcc,
      subject: settings.subject,
      inline: settings.inline,
      attachment: settings.attachment,
      tls: settings.tls,
      template: {
        text: await template.getTemplateBody(),
        context: await template.composeData(),
      },
    });
  }
}
