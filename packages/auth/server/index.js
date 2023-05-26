export { default as initAuth } from './initAuth'
export { default as BaseProvider } from './BaseProvider'
export { finishAuth, loginLock, linkAccount } from './helpers'
export { ensureAuthState, isLoggedIn } from './middlewares'

// singleton
class Auth {}
export const auth = new Auth()
