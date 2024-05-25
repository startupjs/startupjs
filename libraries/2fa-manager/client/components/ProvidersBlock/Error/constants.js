export const CODES = {
  SERVER_ERR: 'server_err',
  VERIFICATION_ERR: 'verification_err'
}

export const MESSAGES = {
  [CODES.SERVER_ERR]: 'Something went wrong. Try again in 5 minutes.',
  [CODES.VERIFICATION_ERR]: 'Incorrect verification code.'
}
