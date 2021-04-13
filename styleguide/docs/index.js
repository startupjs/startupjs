import docs from '@startupjs/docs'
import uiDocs from '@startupjs/ui/docs'
import { faSortNumericUpAlt, faProjectDiagram, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import twoFADocs from '../../packages/2fa/docs'
import NotificationEn from '../../packages/push-notifications/docs/push-notifications.en.mdx'
import NotificationRu from '../../packages/push-notifications/docs/push-notifications.ru.mdx'
import AuthMain from '../../packages/auth/readme.md'
import AuthApple from '../../packages/auth-apple/readme.md'
import AuthAzuread from '../../packages/auth-azuread/readme.md'
import AuthCommon from '../../packages/auth-common/readme.md'
import AuthFacebook from '../../packages/auth-facebook/readme.md'
import AuthGoogle from '../../packages/auth-google/readme.md'
import AuthLinkedin from '../../packages/auth-linkedin/readme.md'
import AuthLocal from '../../packages/auth-local/readme.md'
import ScrollableAnchorsEn from '../../packages/scrollable-anchors/readme/readme.en.mdx'
import ScrollableAnchorsRu from '../../packages/scrollable-anchors/readme/readme.ru.mdx'
import PluginEn from '../../packages/plugin/readme/readme.en.mdx'
import PluginRu from '../../packages/plugin/readme/readme.ru.mdx'
import RecaptchaEn from '../../packages/recaptcha/readme/readme.en.mdx'
import RecaptchaRu from '../../packages/recaptcha/readme/readme.ru.mdx'
import * as guides from '../../docs/migration-guides'

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
        title: 'Главный модуль',
        component: AuthMain
      },
      apple: {
        type: 'mdx',
        title: 'Apple',
        component: AuthApple
      },
      azuread: {
        type: 'mdx',
        title: 'Azure AD',
        component: AuthAzuread
      },
      common: {
        type: 'mdx',
        title: 'Общая',
        component: AuthCommon
      },
      facebook: {
        type: 'mdx',
        title: 'Facebook',
        component: AuthFacebook
      },
      google: {
        type: 'mdx',
        title: 'Google',
        component: AuthGoogle
      },
      linkedin: {
        type: 'mdx',
        title: 'Linkedin',
        component: AuthLinkedin
      },
      local: {
        type: 'mdx',
        title: 'Локальная',
        component: AuthLocal
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
      anchors: {
        type: 'mdx',
        title: {
          en: 'Scrollable anchors',
          ru: 'Якоря с прокрутой'
        },
        component: {
          en: ScrollableAnchorsEn,
          ru: ScrollableAnchorsRu
        }
      },
      ...twoFADocs,
      'push-notifications': {
        type: 'mdx',
        title: 'Push notifications',
        component: {
          en: NotificationEn,
          ru: NotificationRu
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
