import { ScrollView as OriginalScrollView } from 'react-native'
import { pug, styl, observer } from 'startupjs'

export default observer(function ScrollView ({ full, ...props }) {
  return pug`
    OriginalScrollView.root(part='root' styleName={ full } ...props)
  `
  styl`
    .root
      &.full
        &:part(contentContainer)
          min-height 100%
  `
})
