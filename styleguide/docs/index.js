import docs from '@startupjs/docs'
import uiDocs from '@startupjs/ui/docs'
import { faSortNumericUpAlt, faProjectDiagram, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import AuthMain from '../../packages/auth/readme.md'
import AuthLocal from '../../packages/auth-local/readme.md'
import AuthFacebook from '../../packages/auth-facebook/readme.md'
import AuthGoogle from '../../packages/auth-google/readme.md'
import AuthLinkedin from '../../packages/auth-linkedin/readme.md'
import AuthAzuread from '../../packages/auth-azuread/readme.md'
import AuthCommon from '../../packages/auth-common/readme.md'
import ScrollableAnchorsRu from '../../packages/scrollable-anchors/readme/readme.ru.mdx'
import ScrollableAnchorsEn from '../../packages/scrollable-anchors/readme/readme.en.mdx'
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
      },
      common: {
        type: 'mdx',
        title: 'Общая',
        component: AuthCommon
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
