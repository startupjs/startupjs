import { useLocation, useHistory } from 'react-router-dom'
import * as COMPONENTS from 'ui'

export default function useComponentName () {
  const location = useLocation()
  const history = useHistory()
  const path = location.pathname
  const componentName = path.replace(/\//g, '') || Object.keys(COMPONENTS)[0]
  const setComponentName = (name) => {
    history.push(name)
  }
  return [componentName, setComponentName]
}
