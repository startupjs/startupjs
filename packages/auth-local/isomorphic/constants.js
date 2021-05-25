export const LOCAL_LOGIN_URL = '/auth/local-login'
export const REGISTER_URL = '/auth/local-register'
export const CREATE_PASS_RESET_SECRET_URL = '/auth/recover-password'
export const RESET_PASSWORD_URL = '/auth/reset-password'
export const CHANGE_PASSWORD_URL = '/auth/change-password'
export const CREATE_EMAIL_CHANGE_SECRET_URL = '/auth/create-email-change-secret'
export const CHANGE_EMAIL_URL = '/auth/change-email'

export const DEFAULT_PASS_RESET_TIME_LIMIT = 60 * 1000 * 10 // 10 mins in ms

/* eslint-disable-next-line */
export const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
