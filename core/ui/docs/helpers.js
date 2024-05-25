/* @asyncImports */
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import DialogsEn from '../components/dialogs/dialogs.en.mdx'
import DialogsRu from '../components/dialogs/dialogs.ru.mdx'
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
    Dialogs: {
      type: 'mdx',
      title: 'Dialogs',
      component: {
        en: DialogsEn,
        ru: DialogsRu
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
