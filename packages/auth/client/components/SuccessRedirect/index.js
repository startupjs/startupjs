import { useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useHistory } from 'react-router'

export default function SuccessRedirect ({ children }) {
  const history = useHistory()
  const [isRender, setIsRender] = useState(false)

  useMemo(() => {
    (async () => {
      const url = await AsyncStorage.getItem('successRedirectUrl')

      if (url) {
        await AsyncStorage.removeItem('successRedirectUrl')
        history.push(url)
      }

      setIsRender(true)
    })()
  }, [])

  if (!isRender) return null
  return children
}
