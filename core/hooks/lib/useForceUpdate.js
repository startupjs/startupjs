import { useState } from 'react'

export default function useForceUpdate () {
  const [, setTick] = useState()
  return () => {
    setTick(Math.random())
  }
}
