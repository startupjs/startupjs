/* @asyncImports */
import { faWindowRestore } from '@fortawesome/free-solid-svg-icons/faWindowRestore'
import DrawerRu from '../components/popups/Drawer/Drawer.ru.mdx'
import DrawerEn from '../components/popups/Drawer/Drawer.en.mdx'
import PopoverRu from '../components/popups/Popover/Popover.ru.mdx'
import PopoverEn from '../components/popups/Popover/Popover.en.mdx'
import DropdownRu from '../components/popups/Dropdown/docs/Dropdown.ru.mdx'
import DropdownEn from '../components/popups/Dropdown/docs/Dropdown.en.mdx'

export default {
  type: 'collapse',
  title: {
    en: 'Popups',
    ru: 'Всплывающие эл-ты'
  },
  icon: faWindowRestore,
  items: {
    Drawer: {
      type: 'mdx',
      title: 'Drawer',
      component: {
        en: DrawerEn,
        ru: DrawerRu
      }
    },
    Popover: {
      type: 'mdx',
      title: 'Popover',
      component: {
        en: PopoverEn,
        ru: PopoverRu
      }
    },
    Dropdown: {
      type: 'mdx',
      title: 'Dropdown',
      component: {
        en: DropdownEn,
        ru: DropdownRu
      }
    }
  }
}
