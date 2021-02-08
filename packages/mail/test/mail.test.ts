import { Mail } from '../src'
import { Provider1 } from './providers/Provider1'
import { Provider2 } from './providers/Provider2'
import { Provider3 } from './providers/Provider3'
import { Template1 } from './templates/Template1'
import { Template2 } from './templates/Template2'
import { Template3 } from './templates/Template3'
import { Template4 } from './templates/Template4'

describe('Check mail with', () => {
  it('one default provider and one default template', async () => {
    const provider1 = new Provider1()
    const template4 = new Template4()

    const mail: Mail = new Mail({
      providers: [provider1],
      templates: [template4],
      default: { provider: provider1, template: template4 }
    })

    const template = await mail.send({
      from: 'dmitriy@borodin.site',
      to: 'borodin.d8@gmail.com',
      subject: 'one provider and one template'
    })

    expect(template.text).toMatchSnapshot()
    expect(template.context).toMatchSnapshot()
  })

  it('one default provider and one default template of two templates', async () => {
    const provider1 = new Provider1()
    const template3 = new Template3()
    const template4 = new Template4()

    const mail: Mail = new Mail({
      providers: [provider1],
      templates: [template4, template3],
      default: { provider: provider1, template: template4 }
    })

    const template = await mail.send({
      from: 'dmitriy@borodin.site',
      to: 'borodin.d8@gmail.com',
      subject: 'one provider and one template'
    })

    expect(template.text).toMatchSnapshot()
    expect(template.context).toMatchSnapshot()
  })

  it('one default provider and one selected template of two templates', async () => {
    const provider1 = new Provider1()
    const template3 = new Template3()
    const template4 = new Template4()

    const mail: Mail = new Mail({
      providers: [provider1],
      templates: [template4, template3],
      default: { provider: provider1, template: template4 }
    })

    const template = await mail.send({
      from: 'dmitriy@borodin.site',
      to: 'borodin.d8@gmail.com',
      subject: 'one provider and one template',
      template: template3.getName()
    })

    expect(template.text).toMatchSnapshot()
    expect(template.context).toMatchSnapshot()
  })

  it('one default provider and one default template with nested templates', async () => {
    const provider1 = new Provider1()
    const template1 = new Template1()

    const mail: Mail = new Mail({
      providers: [provider1],
      templates: [template1],
      default: { provider: provider1, template: template1 }
    })

    const template = await mail.send({
      from: 'dmitriy@borodin.site',
      to: 'borodin.d8@gmail.com',
      subject: 'one provider and one template'
    })

    expect(template.text).toMatchSnapshot()
    expect(template.context).toMatchSnapshot()
  })

  it('three providers with default provider and one default template', async () => {
    const provider1 = new Provider1()
    const provider2 = new Provider2()
    const provider3 = new Provider3()
    const template4 = new Template4()

    const mail: Mail = new Mail({
      providers: [provider1, provider2, provider3],
      templates: [template4],
      default: { provider: provider2, template: template4 }
    })

    const template = await mail.send({
      from: 'dmitriy@borodin.site',
      to: 'borodin.d8@gmail.com',
      subject: 'one provider and one template'
    })

    expect(template.text).toMatchSnapshot()
    expect(template.context).toMatchSnapshot()
  })

  it('three providers with one selected provider and one default template', async () => {
    const provider1 = new Provider1()
    const provider2 = new Provider2()
    const provider3 = new Provider3()
    const template4 = new Template4()

    const mail: Mail = new Mail({
      providers: [provider1, provider2, provider3],
      templates: [template4],
      default: { provider: provider2, template: template4 }
    })

    const template = await mail.send({
      from: 'dmitriy@borodin.site',
      to: 'borodin.d8@gmail.com',
      subject: 'one provider and one template',
      provider: provider3.getName()
    })

    expect(template.text).toMatchSnapshot()
    expect(template.context).toMatchSnapshot()
  })

  it('three providers with one selected provider and one selected template with nested structure', async () => {
    const provider1 = new Provider1()
    const provider2 = new Provider2()
    const provider3 = new Provider3()
    const template1 = new Template1()
    const template2 = new Template2()
    const template3 = new Template3()
    const template4 = new Template4()

    const mail: Mail = new Mail({
      providers: [provider2, provider1, provider3],
      templates: [template4, template1, template3, template2],
      default: { provider: provider2, template: template4 }
    })

    const template = await mail.send({
      from: 'dmitriy@borodin.site',
      to: 'borodin.d8@gmail.com',
      subject: 'one provider and one template',
      provider: provider1.getName(),
      template: template1.getName()
    })

    expect(template.text).toMatchSnapshot()
    expect(template.context).toMatchSnapshot()
  })
})
