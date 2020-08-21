/* @asyncImports */
import { faLandmark } from '@fortawesome/free-solid-svg-icons'
import TypographyEn from '../../components/typography/Typography.en.mdx'
import TypographyRu from '../../components/typography/Typography.ru.mdx'
import CollectionTypesRu from './collectionTypes.ru.mdx'
import Colors from './colors.mdx'
import BorderRadius from './borderRadius.mdx'

export default {
  type: 'collapse',
  title: {
    en: 'Foundation',
    ru: 'Основы'
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
    }
  }
}
