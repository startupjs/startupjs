import { useState, useEffect } from 'react'
import { getProviders } from '../helpers'

export default function useProviders () {
  const [providers, setProviders] = useState([])

  useEffect(() => {
    async function _getProviders () {
      const _providers = await getProviders()
      setProviders(_providers)
    }
    _getProviders()
  }, [])

  return providers
}
