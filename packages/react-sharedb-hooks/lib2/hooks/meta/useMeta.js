import { useContext } from 'react'
import { MetaContext } from '../../util'

export default function useMeta () {
  return useContext(MetaContext)
}
