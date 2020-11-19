import docs from '@startupjs/docs'
import uiDocs from '@startupjs/ui/docs'
import { faSortNumericUpAlt, faProjectDiagram } from '@fortawesome/free-solid-svg-icons'
import Upgrade022to023 from '../../docs/migration-guides/0.22--0.23.md'
import Upgrade023to024 from '../../docs/migration-guides/0.23--0.24.md'
import Upgrade024to025 from '../../docs/migration-guides/0.24--0.25.md'
import AuthMain from '../../packages/auth/readme.md'
import AuthLocal from '../../packages/auth-local/readme.md'
import AuthFacebook from '../../packages/auth-facebook/readme.md'
import AuthGoogle from '../../packages/auth-google/readme.md'
import AuthLinkedin from '../../packages/auth-linkedin/readme.md'
import AuthAzuread from '../../packages/auth-azuread/readme.md'

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
      local: {
        type: 'mdx',
        title: 'Локальная',
        component: AuthLocal
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
      azuread: {
        type: 'mdx',
        title: 'Azure AD',
        component: AuthAzuread
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
    items: {
      '0.22--0.23.md': {
        type: 'mdx',
        title: '0.22 -> 0.23',
        component: Upgrade022to023
      },
      '0.23--0.24.md': {
        type: 'mdx',
        title: '0.23 -> 0.24',
        component: Upgrade023to024
      },
      '0.24--0.25.md': {
        type: 'mdx',
        title: '0.24 -> 0.25',
        component: Upgrade024to025
      }
    }
  }
})
