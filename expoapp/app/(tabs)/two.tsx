import { useState, useMemo, useRef } from 'react'

import { pug, styl, observer, $, useValue, useValue$ } from 'startupjs'

import EditScreenInfo from '@/components/EditScreenInfo'
import { Text, View } from '@/components/Themed'
import { Button } from 'react-native'

export default observer(function TabTwoScreen() {
  const [count, $count] = useValue(0)
  const [stateCount, setStateCount] = useState(0)
  const idRef = useRef()
  const randomId = useMemo(() => {
    if (!idRef.current) idRef.current = $.id()
    return idRef.current
  }, [])
  return pug`
    View.container
      Text.title Tab Two or yes? no? what's 60
      View.separator(lightColor="#eee" darkColor="rgba(255,255,255,0.1)")
      EditScreenInfo(path="app/(tabs)/two.tsx")
      View.separator(lightColor="#eee" darkColor="rgba(255,255,255,0.1)")
      Button(
        onPress=() => $count.increment()
        title='Model count: ' + count
      )
      View.separator(lightColor="#eee" darkColor="rgba(255,255,255,0.1)")
      Button(
        onPress=() => setStateCount(stateCount + 1)
        title='State count: ' + stateCount
      )
      View.separator(lightColor="#eee" darkColor="rgba(255,255,255,0.1)")
      Text Random id: #{randomId}
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
