import { emit, useLocal } from 'startupjs'
import * as COMPONENTS from 'ui'

export default function useComponentName () {
  const [url] = useLocal('$render.url')
  const componentName = url.replace(/\//g, '') || Object.keys(COMPONENTS)[0]
  const setComponentName = (name) => {
    emit('url', `/${name}`)
  }
  return [componentName, setComponentName]
}
