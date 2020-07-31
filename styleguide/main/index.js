import React from 'react'
import axios from 'axios'
import { observer, useApi } from 'startupjs'
import { Span } from '@startupjs/ui'

import getRoutes from './routes'

const PTest = observer(() => {
  console.log('render')
  const [data] = useApi(() => axios.get('https://reqres.in/api/users?page=2'))
  return pug`
    Span Hello world
    Span= JSON.stringify(data, null, 2)
  `
})

export const Layout = ({ children }) => children
export const routes = getRoutes({ PTest })
