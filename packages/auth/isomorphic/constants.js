export const LOGOUT_URL = '/auth/logout'
export const SIGN_IN_URL = '/auth/sign-in'
export const DEFAUL_SUCCESS_REDIRECT_URL = '/auth/success'
export const LOGIN_LOCK_TIME = 60 * 1000

export const RESET_PASSWORD_SLIDE = 'reset-password'
export const SIGN_IN_SLIDE = 'sign-in'
export const SIGN_UP_SLIDE = 'sign-up'
export const RECOVER_PASSWORD_SLIDE = 'recover'

export const DEFAULT_FORMS_CAPTIONS = {
  [SIGN_IN_SLIDE]: 'Sign In',
  [SIGN_UP_SLIDE]: 'Sign Up',
  [RECOVER_PASSWORD_SLIDE]: 'Forgot password?',
  [RESET_PASSWORD_SLIDE]: 'Reset password'
}

export const FORM_COMPONENTS_KEYS = {
  [SIGN_IN_SLIDE]: 'LoginForm',
  [SIGN_UP_SLIDE]: 'RegisterForm',
  [RECOVER_PASSWORD_SLIDE]: 'RecoverForm',
  [RESET_PASSWORD_SLIDE]: 'ResetPasswordForm'
}
