import { useState, useMemo, useRef } from 'react'

import { pug, styl, observer, $, useDoc$ } from 'startupjs'

import EditScreenInfo from '@/components/EditScreenInfo'
import { Text, View } from '@/components/Themed'
import { Button, Div } from '@startupjs/ui'

export default observer(function TabTwoScreen() {
  const $count = useDoc$('testCounts', 'magicCount1')
  if (!$count.get()) throw $count.create({ value: 0 })
  const [stateCount, setStateCount] = useState(0)
  const idRef = useRef()
  const randomId = useMemo(() => {
    if (!idRef.current) idRef.current = $.id()
    return idRef.current
  }, [])
  return pug`
    View.container
      Text.title Tab Two or yes? no? what's 80
      View.separator(lightColor="#eee" darkColor="rgba(255,255,255,0.1)")
      EditScreenInfo(path="app/(tabs)/two.tsx")
      View.separator(lightColor="#eee" darkColor="rgba(255,255,255,0.1)")
      Div(row)
        Button(onPress=() => $count.value.increment(-1)) -
        Button(pushed onPress=() => $count.value.increment())
          | Model count: #{$count.value.get()}
      View.separator(lightColor="#eee" darkColor="rgba(255,255,255,0.1)")
      Button(onPress=() => setStateCount(stateCount + 1))
        | State count: #{stateCount}
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
