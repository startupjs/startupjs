export const LOCAL_LOGIN_URL = '/auth/local-login'
export const REGISTER_URL = '/auth/local-register'
export const CREATE_PASS_RESET_SECRET_URL = '/auth/recoverpassword'

export const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const FORM_REGEXPS = {
  email: {
    re: EMAIL_REGEXP,
    error: 'Please enter correct email.'
  },
  password: {
    re: /^.{8,32}$/,
    error: 'Your password must be between 8 - 32 characters long'
  },
  name: {
    re: /^.+\s.+$/,
    error: 'Please enter your name'
  }
}
