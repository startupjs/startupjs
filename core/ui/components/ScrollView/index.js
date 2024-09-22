import { ScrollView as OriginalScrollView } from 'react-native'
import { pug, styl, observer } from 'startupjs'

export default observer(function ScrollView ({ full, ...props }, ref) {
  return pug`
    OriginalScrollView.root(ref=ref part='root' styleName={ full } ...props)
  `
  styl`
    .root
      &.full
        &:part(contentContainer)
          min-height 100%
  `
}, { forwardRef: true })
