import docs from '@startupjs/docs'
import uiDocs from '@startupjs/ui/docs'
import { faSortNumericUpAlt } from '@fortawesome/free-solid-svg-icons'
import Upgrade022to023 from '../../docs/migration-guides/0.22--0.23.md'
import Upgrade023to024 from '../../docs/migration-guides/0.23--0.24.md'
import Upgrade024to025 from '../../docs/migration-guides/0.24--0.25.md'

export default docs({
  ...uiDocs,
  'migration-guides': {
    type: 'collapse',
    title: {
      en: 'Upgrade',
      ru: 'Обновление'
    },
    icon: faSortNumericUpAlt,
    items: {
      '022to023': {
        type: 'mdx',
        title: '0.22 -> 0.23',
        component: Upgrade022to023
      },
      '023to024': {
        type: 'mdx',
        title: '0.23 -> 0.24',
        component: Upgrade023to024
      },
      '024to025': {
        type: 'mdx',
        title: '0.24 -> 0.25',
        component: Upgrade024to025
      }
    }
  }
})
