import { useEffect } from 'react'
import { emit } from 'startupjs'
import getRoutes from './routes'

export const Layout = ({ children }) => children
export const routes = getRoutes({
  PHome: () => {
    useEffect(() => { emit('url', '/docs', true) }, [])
    return null
  }
})
