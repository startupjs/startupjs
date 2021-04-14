export const LOGOUT_URL = '/auth/logout'
export const SIGN_IN_URL = '/auth/sign-in'
export const SIGN_UP_URL = '/auth/sign-up'
export const RECOVER_PASS_URL = '/auth/recover'
export const LOGIN_LOCK_TIME = 60 * 1000

export const SIGN_IN_SLIDE = 'sign-in'
export const SIGN_UP_SLIDE = 'sign-up'
export const RECOVER_PASSWORD_SLIDE = 'recover'
export const RESET_PASSWORD_SLIDE = 'reset-password'
export const CHANGE_PASSWORD_SLIDE = 'change-password'

export const DEFAULT_FORMS_CAPTIONS = {
  [SIGN_IN_SLIDE]: 'Welcome Back!',
  [SIGN_UP_SLIDE]: 'Sign Up',
  [RECOVER_PASSWORD_SLIDE]: 'Forgot password?',
  [RESET_PASSWORD_SLIDE]: 'Reset password',
  [CHANGE_PASSWORD_SLIDE]: 'Update password'
}

export const DEFAULT_FORMS_DESCRIPTIONS = {
  [SIGN_IN_SLIDE]: 'Log In with',
  [SIGN_UP_SLIDE]: undefined,
  [RECOVER_PASSWORD_SLIDE]: undefined,
  [RESET_PASSWORD_SLIDE]: undefined,
  [CHANGE_PASSWORD_SLIDE]: undefined
}

export const LINKED_PROVIDER_ERROR = 'Another account with same provider already linked!'
export const ACCOUNT_LINKED_INFO = 'Account linked successful!'
export const ACCOUNT_ALREADY_LINKED_ERROR = 'Account is already linked to your profile.'
export const ACCOUNT_ALREADY_LINKED_TO_ANOHER_PROFILE_ERROR = 'Account is already linked to another profile.'
