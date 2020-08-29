/* @asyncImports */
import { faCode } from '@fortawesome/free-solid-svg-icons'
import useMediaEn from '../hooks/useMedia.en.mdx'
import useMediaRu from '../hooks/useMedia.ru.mdx'

export default {
  type: 'collapse',
  title: {
    en: 'Helpers',
    ru: 'Хелперы'
  },
  icon: faCode,
  items: {
    useMedia: {
      type: 'mdx',
      title: 'useMedia',
      component: {
        en: useMediaEn,
        ru: useMediaRu
      }
    }
  }
}
