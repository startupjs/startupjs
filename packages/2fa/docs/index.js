import TwoFARu from './2fa.ru.mdx'
import TwoFAEn from './2fa.en.mdx'

export default {
  '2FA': {
    type: 'mdx',
    title: '2FA',
    component: {
      en: TwoFAEn,
      ru: TwoFARu
    }
  }
}
