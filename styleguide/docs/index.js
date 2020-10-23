import docs from '@startupjs/docs'
import uiDocs from '@startupjs/ui/docs'
import { faSortNumericUpAlt } from '@fortawesome/free-solid-svg-icons'
import * as guides from '../../docs/migration-guides'

function generateGuideItems () {
  const res = {}
  for (const name in guides) {
    const version = name.replace(/^_/, '').replace(/_/g, '.')
    res[`${version}.md`] = {
      type: 'mdx',
      title: version,
      component: guides[name]
    }
  }
  return res
}

const GUIDE_ITEMS = generateGuideItems()

export default docs({
  ...uiDocs,
  'migration-guides': {
    type: 'collapse',
    title: {
      en: 'Upgrade',
      ru: 'Обновление'
    },
    icon: faSortNumericUpAlt,
    items: GUIDE_ITEMS
  }
})
