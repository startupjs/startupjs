import { useState } from 'react'

export default function __useStyleStates () {
  const [state, setState] = useState({})
  return [state, setState]
}
