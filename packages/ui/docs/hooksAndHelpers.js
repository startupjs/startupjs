/* @asyncImports */
import { faCode } from '@fortawesome/free-solid-svg-icons'
import DialogEn from '../components/Dialog/Dialog.en.mdx'
import DialogRu from '../components/Dialog/Dialog.ru.mdx'
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
    Dialog: {
      type: 'mdx',
      title: 'dialogs',
      component: {
        en: DialogEn,
        ru: DialogRu
      }
    },
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
