import { useState, useEffect } from 'react'

export default function useDrawerDismiss (callbacks) {
  const [state, setState] = useState({ tag: 'default', data: null })

  useEffect(() => {
    if (state.tag !== 'default') {
      callbacks.default()
    }
  })

  return [
    () => {
      callbacks[state.tag](state.data)
      setState({ tag: 'default', data: null })
    },
    (tag, data) => setState({ tag, data })
  ]
}
