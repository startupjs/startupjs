/* @asyncImports */
import { faLandmark } from '@fortawesome/free-solid-svg-icons'
import TypographyEn from '../../components/typography/Typography.en.mdx'
import TypographyRu from '../../components/typography/Typography.ru.mdx'

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
    }
  }
}
