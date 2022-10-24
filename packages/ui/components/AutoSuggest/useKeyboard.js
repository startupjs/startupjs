import { useState } from 'react'

export default function useKeyboard ({
  options,
  onChange,
  onChangeShow
}) {
  const [selectIndexValue, setSelectIndexValue] = useState(-1)

  function onKeyPress (e) {
    const keyName = e.key

    switch (keyName) {
      case 'ArrowUp': {
        e.preventDefault()

        const nextIndex = selectIndexValue - 1

        if (nextIndex < 0) {
          setSelectIndexValue(options.length - 1)
          return
        }

        setSelectIndexValue(nextIndex)
        break
      }
      case 'ArrowDown': {
        e.preventDefault()

        const nextIndex = selectIndexValue + 1

        if (nextIndex === options.length) {
          setSelectIndexValue(0)
          return
        }

        setSelectIndexValue(nextIndex)
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (selectIndexValue === -1) return
        const item = options.find((_, i) => i === selectIndexValue)
        onChangeShow(false)
        onChange && onChange(item)
        setSelectIndexValue(-1)
        break
      }
    }
  }

  return [selectIndexValue, setSelectIndexValue, onKeyPress]
}
