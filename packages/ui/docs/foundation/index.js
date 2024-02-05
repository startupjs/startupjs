/* @asyncImports */
import { faLandmark } from '@fortawesome/free-solid-svg-icons/faLandmark'
import BorderRadius from './borderRadius.mdx'
import CollectionTypesRu from './collectionTypes.ru.mdx'
import Colors from './colors.mdx'
import ColorCustomization from './colorCustomization.mdx'
import EditingRu from './editing.ru.mdx'
import ExportCSStoJSEn from './exportCSStoJS.en.mdx'
import ExportCSStoJSRu from './exportCSStoJS.ru.mdx'
import NodeModulesCacheEn from './nodeModulesCache.en.mdx'
import NodeModulesCacheRu from './nodeModulesCache.ru.mdx'
import SecurityRu from './security.ru.mdx'
import WebsocketEn from './websocket.en.mdx'
import WebsocketRu from './websocket.ru.mdx'
import E2ETestsRu from './e2e-tests.ru.mdx'
import E2ETestsEn from './e2e-tests.en.mdx'
import FontsEn from '../../components/typography/Fonts.en.mdx'
import FontsRu from '../../components/typography/Fonts.ru.mdx'
import TypographyEn from '../../components/typography/Typography.en.mdx'
import TypographyRu from '../../components/typography/Typography.ru.mdx'

export default {
  type: 'collapse',
  title: {
    en: 'General',
    ru: 'Общее'
  },
  icon: faLandmark,
  items: {
    borderRadius: {
      type: 'mdx',
      title: {
        en: 'Border Radius',
        ru: 'Border Radius'
      },
      component: BorderRadius
    },
    collections: {
      type: 'mdx',
      title: {
        en: 'Collection types',
        ru: 'Типы коллекций'
      },
      component: CollectionTypesRu
    },
    colors: {
      type: 'mdx',
      title: {
        en: 'Colors',
        ru: 'Цвета'
      },
      component: Colors
    },
    colorCustomization: {
      type: 'mdx',
      title: {
        en: 'Colors customization',
        ru: 'Кастомизация цветов'
      },
      component: ColorCustomization
    },
    editing: {
      type: 'mdx',
      title: {
        en: 'Editing implementations',
        ru: 'Способы редактирования'
      },
      component: EditingRu
    },
    exportingCSStoJS: {
      type: 'mdx',
      title: {
        en: 'Export CSS to JS',
        ru: 'Экспорт CSS в JS'
      },
      component: {
        en: ExportCSStoJSEn,
        ru: ExportCSStoJSRu
      }
    },
    nodeModulesCache: {
      type: 'mdx',
      title: {
        en: 'Caching node_modules',
        ru: 'Кеширование node_modules'
      },
      component: {
        en: NodeModulesCacheEn,
        ru: NodeModulesCacheRu
      }
    },
    fonts: {
      type: 'mdx',
      title: {
        en: 'Custom Fonts',
        ru: 'Свои Шрифты'
      },
      component: {
        en: FontsEn,
        ru: FontsRu
      }
    },
    security: {
      type: 'mdx',
      title: {
        en: 'Security',
        ru: 'Безопасность'
      },
      component: SecurityRu
    },
    typography: {
      type: 'mdx',
      title: {
        en: 'Typography',
        ru: 'Типографика'
      },
      component: {
        en: TypographyEn,
        ru: TypographyRu
      }
    },
    websocket: {
      type: 'mdx',
      title: {
        en: 'Websocket',
        ru: 'Веб-сокет'
      },
      component: {
        en: WebsocketEn,
        ru: WebsocketRu
      }
    },
    testE2E: {
      type: 'mdx',
      title: {
        en: 'E2E Testing',
        ru: 'E2E тестирование'
      },
      component: {
        en: E2ETestsEn,
        ru: E2ETestsRu
      }
    }
  }
}
