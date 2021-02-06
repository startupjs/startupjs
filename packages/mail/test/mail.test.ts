import { Mail } from '../src'
import { Provider1 } from './providers/Provider1'
import { Template1 } from './templates/Template1'

describe('Check mail with', () => {
  it('one provider and one template', async () => {
    const provider1 = new Provider1()
    const template1 = new Template1()

    const mail: Mail = new Mail({
      providers: [provider1],
      templates: [template1],
      default: { provider: provider1, template: template1 }
    })

    expect(
      await mail.send({
        from: 'dmitriy@borodin.site',
        to: 'borodin.d8@gmail.com',
        subject: 'one provider and one template'
      })
    ).toMatchSnapshot()
  })
})
