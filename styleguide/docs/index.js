import docs from '@startupjs/docs'
import { faSortNumericUpAlt, faProjectDiagram, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import uiDocs from '../../packages/ui/docs'
import AuthMainRu from '../../packages/auth/docs/readme.ru.md'
import AuthMainEn from '../../packages/auth/docs/readme.en.md'
import AuthAppleRu from '../../packages/auth-apple/docs/readme.ru.md'
import AuthAppleEn from '../../packages/auth-apple/docs/readme.en.md'
import AuthAzureadRu from '../../packages/auth-azuread/docs/readme.ru.md'
import AuthAzureadEn from '../../packages/auth-azuread/docs/readme.en.md'
import AuthCommonRu from '../../packages/auth-common/docs/readme.ru.md'
import AuthCommonEn from '../../packages/auth-common/docs/readme.en.md'
import AuthFacebookRu from '../../packages/auth-facebook/docs/readme.ru.md'
import AuthFacebookEn from '../../packages/auth-facebook/docs/readme.en.md'
import AuthGoogleRu from '../../packages/auth-google/docs/readme.ru.md'
import AuthGoogleEn from '../../packages/auth-google/docs/readme.en.md'
import AuthLinkedinRu from '../../packages/auth-linkedin/docs/readme.ru.md'
import AuthLinkedinEn from '../../packages/auth-linkedin/docs/readme.en.md'
import AuthLocalRu from '../../packages/auth-local/docs/readme.ru.md'
import AuthLocalEn from '../../packages/auth-local/docs/readme.en.md'
import i18nEn from '../../packages/i18n/readme/readme.en.mdx'
import i18nRu from '../../packages/i18n/readme/readme.ru.mdx'
import mailgunEn from '../../packages/mailgun/readme/readme.en.mdx'
import PluginEn from '../../packages/plugin/readme/readme.en.mdx'
import PluginRu from '../../packages/plugin/readme/readme.ru.mdx'
import PushNotificationsEn from '../../packages/push-notifications/docs/push-notifications.en.mdx'
import PushNotificationsRu from '../../packages/push-notifications/docs/push-notifications.ru.mdx'
import RecaptchaEn from '../../packages/recaptcha/readme/readme.en.mdx'
import RecaptchaRu from '../../packages/recaptcha/readme/readme.ru.mdx'
import ScrollableAnchorsEn from '../../packages/scrollable-anchors/readme/readme.en.mdx'
import ScrollableAnchorsRu from '../../packages/scrollable-anchors/readme/readme.ru.mdx'
import * as guides from '../../docs/migration-guides'

// 2fa
import PushProviderEn from '../../packages/2fa-push-notification-provider/docs/push-notifications.en.mdx'
import PushProviderRu from '../../packages/2fa-push-notification-provider/docs/push-notifications.ru.mdx'
import TOTPProviderEn from '../../packages/2fa-totp-authentication-provider/docs/2fa-totp-authentication-provider.en.mdx'
import TOTPProviderRu from '../../packages/2fa-totp-authentication-provider/docs/2fa-totp-authentication-provider.ru.mdx'
import TwoFAManagerEn from '../../packages/2fa-manager/docs/2fa-manager.en.mdx'
import TwoFAManagerRu from '../../packages/2fa-manager/docs/2fa-manager.ru.mdx'
import TwoFAGAEn from '../../packages/2fa-totp-authentication/docs/2fa-totp-authentication.en.mdx'
import TwoFAGARu from '../../packages/2fa-totp-authentication/docs/2fa-totp-authentication.ru.mdx'

function generateGuideItems () {
  const res = {}
  for (const name in guides) {
    const version = name.replace(/^_/, '').replace(/_/g, '.')
    res[`${version}.md`] = {
      type: 'mdx',
      title: version,
      component: guides[name]
    }
  }
  return res
}

const GUIDE_ITEMS = generateGuideItems()

export default docs({
  ...uiDocs,
  auth: {
    type: 'collapse',
    title: {
      en: 'Authorization',
      ru: 'Авторизация'
    },
    icon: faProjectDiagram,
    items: {
      main: {
        type: 'mdx',
        title: {
          en: 'Main module',
          ru: 'Главный модуль'
        },
        component: {
          en: AuthMainEn,
          ru: AuthMainRu
        }
      },
      apple: {
        type: 'mdx',
        title: 'Apple',
        component: {
          en: AuthAppleEn,
          ru: AuthAppleRu
        }
      },
      azuread: {
        type: 'mdx',
        title: 'Azure AD',
        component: {
          en: AuthAzureadEn,
          ru: AuthAzureadRu
        }
      },
      common: {
        type: 'mdx',
        title: {
          en: 'Common',
          ru: 'Общая'
        },
        component: {
          en: AuthCommonEn,
          ru: AuthCommonRu
        }
      },
      facebook: {
        type: 'mdx',
        title: 'Facebook',
        component: {
          en: AuthFacebookEn,
          ru: AuthFacebookRu
        }
      },
      google: {
        type: 'mdx',
        title: 'Google',
        component: {
          en: AuthGoogleEn,
          ru: AuthGoogleRu
        }
      },
      linkedin: {
        type: 'mdx',
        title: 'Linkedin',
        component: {
          en: AuthLinkedinEn,
          ru: AuthLinkedinRu
        }
      },
      local: {
        type: 'mdx',
        title: {
          en: 'Local',
          ru: 'Локальная'
        },
        component: {
          en: AuthLocalEn,
          ru: AuthLocalRu
        }
      }
    }
  },
  libraries: {
    type: 'collapse',
    title: {
      en: 'Libraries',
      ru: 'Библиотеки'
    },
    icon: faLayerGroup,
    items: {
      '2fa': {
        type: 'collapse',
        title: {
          en: '2fa',
          ru: '2fa'
        },
        items: {
          TwoFAManager: {
            type: 'mdx',
            title: {
              en: 'Manager',
              ru: 'Менеджер'
            },
            component: {
              en: TwoFAManagerEn,
              ru: TwoFAManagerRu
            }
          },
          '2fa-totp-authentication': {
            type: 'mdx',
            title: 'Totp authentication',
            component: {
              en: TwoFAGAEn,
              ru: TwoFAGARu
            }
          },
          GAProvider: {
            type: 'mdx',
            title: 'Totp authentication Provider',
            component: {
              en: TOTPProviderEn,
              ru: TOTPProviderRu
            }
          },
          PushProvider: {
            type: 'mdx',
            title: 'Push notificaton Provider',
            component: {
              en: PushProviderEn,
              ru: PushProviderRu
            }
          }
        }
      },
      i18n: {
        type: 'mdx',
        title: {
          en: 'i18n',
          ru: 'i18n'
        },
        component: {
          en: i18nEn,
          ru: i18nRu
        }
      },
      mailgun: {
        type: 'mdx',
        title: 'Mailgun',
        component: mailgunEn
      },
      'push-notofications': {
        type: 'mdx',
        title: {
          en: 'Push',
          ru: 'Push'
        },
        component: {
          en: PushNotificationsEn,
          ru: PushNotificationsRu
        }
      },
      plugins: {
        type: 'mdx',
        title: {
          en: 'Plugins',
          ru: 'Плагины'
        },
        component: {
          en: PluginEn,
          ru: PluginRu
        }
      },
      recaptcha: {
        type: 'mdx',
        title: {
          en: 'reCaptcha',
          ru: 'Капча'
        },
        component: {
          en: RecaptchaEn,
          ru: RecaptchaRu
        }
      },
      'scrollable-anchors': {
        type: 'mdx',
        title: {
          en: 'Scrollable anchors',
          ru: 'Якоря с прокрутой'
        },
        component: {
          en: ScrollableAnchorsEn,
          ru: ScrollableAnchorsRu
        }
      }
    }
  },
  'migration-guides': {
    type: 'collapse',
    title: {
      en: 'Upgrade',
      ru: 'Обновление'
    },
    icon: faSortNumericUpAlt,
    items: GUIDE_ITEMS
  }
})
