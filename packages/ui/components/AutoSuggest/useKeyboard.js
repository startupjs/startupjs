import { useState } from 'react'

export default function useKeyboard ({
  _data,
  value,
  onChange,
  onChangeShow
}) {
  const [selectIndexValue, setSelectIndexValue] = useState(-1)

  function onKeyPress (e) {
    let item, index
    const keyName = e.key

    switch (keyName) {
      case 'ArrowUp':
        e.preventDefault()
        if (selectIndexValue === 0 || (selectIndexValue === -1 && !value.value)) return

        index = selectIndexValue - 1
        if (selectIndexValue === -1 && value.value) {
          index = _data.current.findIndex(item => item.value === value.value)
          index--
        }

        setSelectIndexValue(index)
        break

      case 'ArrowDown':
        e.preventDefault()
        if (selectIndexValue === _data.current.length - 1) return

        index = selectIndexValue + 1
        if (selectIndexValue === -1 && value) {
          index = _data.current.findIndex(item => item.value === value.value)
          index++
        }

        setSelectIndexValue(index)
        break

      case 'Enter':
        e.preventDefault()
        if (selectIndexValue === -1) return
        item = _data.current.find((_, i) => i === selectIndexValue)
        onChangeShow(false)
        onChange && onChange(item)
        break
    }
  }

  return [selectIndexValue, setSelectIndexValue, onKeyPress]
}
