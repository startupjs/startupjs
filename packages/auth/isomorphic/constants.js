export const LOGOUT_URL = '/auth/logout'
export const SIGN_IN_URL = '/auth/sign-in'
export const SIGN_UP_URL = '/auth/sign-up'
export const RECOVER_PASS_URL = '/auth/recover'
export const RESET_PASS_URL = '/auth/reset-password'
export const ERROR_URL = '/auth/error'
export const CONFIRMED_EMAIL_URL = '/auth/confirmed-email'

export const LOGIN_LOCK_MINUTES = 5

export const REQUEST_CONFIRMATION_SLIDE = 'request-confirmation'
export const CHANGE_PASSWORD_SLIDE = 'change-password'
export const RECOVER_PASSWORD_SLIDE = 'recover'
export const RESET_PASSWORD_SLIDE = 'reset-password'
export const SIGN_IN_SLIDE = 'sign-in'
export const SIGN_UP_SLIDE = 'sign-up'

export const DEFAULT_FORMS_CAPTIONS = {
  [CHANGE_PASSWORD_SLIDE]: 'Update password',
  [RECOVER_PASSWORD_SLIDE]: 'Forgot password?',
  [RESET_PASSWORD_SLIDE]: 'Reset password',
  [REQUEST_CONFIRMATION_SLIDE]: 'Email confirmation',
  [SIGN_IN_SLIDE]: 'Welcome Back!',
  [SIGN_UP_SLIDE]: 'Sign Up'
}

export const DEFAULT_FORMS_DESCRIPTIONS = {
  [CHANGE_PASSWORD_SLIDE]: null,
  [RECOVER_PASSWORD_SLIDE]: null,
  [RESET_PASSWORD_SLIDE]: null,
  [REQUEST_CONFIRMATION_SLIDE]: null,
  [SIGN_IN_SLIDE]: 'Log In with',
  [SIGN_UP_SLIDE]: null
}

export const LINKED_PROVIDER_ERROR = 'Another account with same provider already linked!'
export const ACCOUNT_LINKED_INFO = 'Account linked successful!'
export const ACCOUNT_ALREADY_LINKED_ERROR = 'Account is already linked to your profile.'
export const ACCOUNT_ALREADY_LINKED_TO_ANOHER_PROFILE_ERROR = 'Account is already linked to another profile.'
