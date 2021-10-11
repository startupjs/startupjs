import { useRef } from 'react'

export default function useScroll ({
  refScroll,
  value,
  options
}) {
  const itemHeights = useRef([])

  function onLayoutItem (e, index) {
    itemHeights.current[index] = e.nativeEvent.layout.height
  }

  function getItemLayout (data, index) {
    const length = itemHeights.current[index]
    const offset = itemHeights.current.slice(0, index).reduce((a, c) => a + c, 0)
    return { length, offset, index }
  }

  function scrollToActive () {
    const activeIndex = options.findIndex(option => option.value === value.value)
    if (activeIndex === -1) return
    refScroll.current.scrollToIndex({ index: activeIndex, animated: false })
  }

  return {
    scrollToActive,
    getItemLayout,
    onLayoutItem
  }
}
