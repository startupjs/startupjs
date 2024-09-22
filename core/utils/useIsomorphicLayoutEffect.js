import { useEffect, useLayoutEffect } from 'react'
import isServer from './isServer.js'

export default isServer ? useEffect : useLayoutEffect
