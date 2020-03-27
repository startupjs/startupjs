import { useLocation } from 'react-router-dom'
import { emit } from 'startupjs'
import * as COMPONENTS from 'ui'

export default function useComponentName () {
  const location = useLocation()
  const path = location.pathname
  const componentName = path.replace(/\//g, '') || Object.keys(COMPONENTS)[0]
  const setComponentName = (name) => {
    emit('url', `/${name}`)
  }
  return [componentName, setComponentName]
}
