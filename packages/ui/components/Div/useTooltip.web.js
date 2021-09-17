import { useEffect } from 'react'
import useTooltipCommon from './useTooltip.common'

export default function useTooltipWeb (props) {
  function onClose () {
    props.onChange(false)
  }

  useEffect(() => {
    window.addEventListener('wheel', onClose, true)
    return () => window.removeEventListener('wheel', onClose)
  }, [])

  return useTooltipCommon(props)
}
