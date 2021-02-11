/* @asyncImports */
import { faLandmark } from '@fortawesome/free-solid-svg-icons'
import TypographyEn from '../../components/typography/Typography.en.mdx'
import TypographyRu from '../../components/typography/Typography.ru.mdx'
import CollectionTypesRu from './collectionTypes.ru.mdx'
import Colors from './colors.mdx'
import BorderRadius from './borderRadius.mdx'
import ExportCSStoJSEn from './exportCSStoJS.en.mdx'
import ExportCSStoJSRu from './exportCSStoJS.ru.mdx'
import TestingRu from './testing.ru.mdx'
import TestingEn from './testing.en.mdx'

export default {
  type: 'collapse',
  title: {
    en: 'General',
    ru: 'Общее'
  },
  icon: faLandmark,
  items: {
    Typography: {
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
    Collections: {
      type: 'mdx',
      title: {
        en: 'Collection types',
        ru: 'Типы коллекций'
      },
      component: CollectionTypesRu
    },
    Colors: {
      type: 'mdx',
      title: {
        en: 'Colors',
        ru: 'Цвета'
      },
      component: Colors
    },
    BorderRadius: {
      type: 'mdx',
      title: {
        en: 'Border Radius',
        ru: 'Border Radius'
      },
      component: BorderRadius
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
    Testing: {
      type: 'mdx',
      title: {
        en: 'Testing',
        ru: 'Тестирование'
      },
      component: {
        en: TestingEn,
        ru: TestingRu
      }
    }
  }
}
