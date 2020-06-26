/* @asyncImports */
import { faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import DrawerRu from '../components/popups/Drawer/Drawer.ru.mdx'
import PopoverRu from '../components/popups/Popover/Popover.ru.mdx'
import DropdownRu from '../components/popups/Dropdown/Dropdown.ru.mdx'

export default {
  type: 'collapse',
  title: {
    en: 'Popups',
    ru: 'Всплывающие элементы'
  },
  icon: faWindowRestore,
  items: {
    Drawer: {
      type: 'mdx',
      title: 'Drawer',
      component: DrawerRu
    },
    Popover: {
      type: 'mdx',
      title: 'Popover',
      component: PopoverRu
    },
    Dropdown: {
      type: 'mdx',
      title: 'Dropdown',
      component: DropdownRu
    }
  }
}
