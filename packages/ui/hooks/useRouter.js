// this is a universal router hook with a universal interface
// to use in both react-router (pure RN) and expo-router (Expo) projects.
// This is a default implementation for pure RN which uses react-router (our 'startupjs/app' package)
// Expo implementation is in the .expo.js file and uses expo-router.
// The API emulates the expo-router API.
import { useContext } from 'react'
import RouterContext from '@startupjs/utils/RouterContext'

export default function useRouter () {
  const startupjsRouter = useContext(RouterContext)
  if (!startupjsRouter) throw Error(ERRORS.notInRouter)
  return startupjsRouter
}

export function usePathname () {
  return '/'
}

const ERRORS = {
  notInRouter: `
    [@startupjs/router] Router is not found.
    You can only use \`useRouter\` within an active <Router> context.
    <Link /> components also need a <Router> context to work.
  `
}
