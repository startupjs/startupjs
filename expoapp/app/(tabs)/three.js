import { pug, styl, observer } from 'startupjs'

import EditScreenInfo from '@/components/EditScreenInfo'
import { Text, View } from '@/components/Themed'

export default observer(function TabThreeScreen () {
  const address1 = { city: { street: { building: 42, isFlat: true } } }
  const address2 = {}

  return pug`
    View.container
      Text.title Tab Three
      View
        Text= address2.something ?? 'nullish coalescing'
        Text= address1?.city?.street?.building
        if address1?.city?.street?.isFlat
          Text address 1 is flat
        else
          Text address 1 is NOT flat
        if address2?.city?.street?.isFlat
          Text address 2 is flat
        else
          Text address 2 is NOT flat
      View.separator(lightColor='#eee' darkColor='rgba(255,255,255,0.1)')
      EditScreenInfo(path='app/(tabs)/three.js')
  `
})

styl`
  .container
    flex 1
    align-items center
    justify-content center
  .title
    font-size 20px
    font-weight bold
  .separator
    margin 30px 0
    height 1px
    width 80%
`
