export { default as initAuth } from './initAuth.js'
export { default as BaseProvider } from './BaseProvider.js'
export { finishAuth, loginLock, linkAccount } from './helpers/index.js'
export { ensureAuthState, isLoggedIn } from './middlewares/index.js'

// singleton
class Auth {}
export const auth = new Auth()
