export const ERRORS = {
  'missing-input-secret': 'The secret parameter is missing.',
  'invalid-input-secret': 'The secret parameter is invalid or malformed.',
  'missing-input-response': 'The token parameter is missing.',
  'invalid-input-response': 'The token parameter is invalid or malformed.',
  'bad-request': 'The request is invalid or malformed.',
  'timeout-or-duplicate': 'The token is no longer valid: either is too old or has been used previously.'
}

export const ENTERPRISE_ERRORS = {
  AUTOMATION: 'The interaction matches the behavior of an automated agent.',
  UNEXPECTED_ENVIRONMENT: 'The event originated from an illegitimate environment.',
  TOO_MUCH_TRAFFIC: 'Traffic volume from the event source is higher than normal.',
  UNEXPECTED_USAGE_PATTERNS: 'The interaction with your site was significantly different from expected patterns.',
  LOW_CONFIDENCE_SCORE: 'Too little traffic was received from this site to generate quality risk analysis.'
}
