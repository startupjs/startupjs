const URL_PREFIX = '/auth'
export const CHANGE_EMAIL_URL = `${URL_PREFIX}/change-email`
export const CHANGE_PASSWORD_URL = `${URL_PREFIX}/change-password`
export const CONFIRM_REGISTRATION_URL = `${URL_PREFIX}/confirm-registration`
export const CREATE_EMAIL_CHANGE_SECRET_URL = `${URL_PREFIX}/create-email-change-secret`
export const CREATE_PASS_RESET_SECRET_URL = `${URL_PREFIX}/recover-password`
export const LOCAL_LOGIN_URL = `${URL_PREFIX}/local-login`
export const REGISTER_URL = `${URL_PREFIX}/local-register`
export const RESET_PASSWORD_URL = `${URL_PREFIX}/reset-password`

export const DEFAULT_PASS_RESET_TIME_LIMIT = 60 * 1000 * 10 // 10 mins in ms
export const DEFAULT_CONFIRM_EMAIL_TIME_LIMIT = 60 * 1000 * 60 * 24 * 3 // 3 days in ms

/* eslint-disable-next-line */
export const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
