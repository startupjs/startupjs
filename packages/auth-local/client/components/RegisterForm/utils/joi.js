import Joi from '@hapi/joi'

// VALIDATION SETTINGS
const defaultNameValidationSettings = Joi.string().required()
  .regex(/^.+\s.+$/)
  .messages({
    'any.required': 'Fill in the field',
    'string.empty': 'Fill in the field',
    'string.pattern.base': 'Please enter your full name'
  })

const defaultEmailValidationSettings = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: false } })
  .required()
  .messages({
    'any.required': 'Fill in the field',
    'string.empty': 'Fill in the field',
    'string.email': 'Invalid email'
  })

const defaulPasswordValidationSettings = Joi.string().required()
  .min(3)
  .max(32)
  .messages({
    'any.required': 'Fill in the field',
    'string.empty': 'Fill in the field',
    'string.min': 'Your password must be between 8 - 32 characters long',
    'string.max': 'Your password must be between 8 - 32 characters long'
  })

const defaultVerifyPasswordValidationSettings = Joi.string().required()
  .valid(Joi.ref('password'))
  .messages({
    'any.required': 'Fill in the field',
    'string.empty': 'Fill in the field',
    'any.only': 'Passwords do not match'
  })
// ------------------------------------------------------------------------------

export default Joi.object().keys({
  name: defaultNameValidationSettings,
  email: defaultEmailValidationSettings,
  password: defaulPasswordValidationSettings,
  confirm: defaultVerifyPasswordValidationSettings
})

export const complexPasswordSchema = Joi.object().keys({
  name: defaultNameValidationSettings,
  email: defaultEmailValidationSettings,
  password: Joi.string().required()
    .min(3)
    .max(32)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&#$^])[A-Za-z\d_@$!%*-?&#^]{8,}$/)
    .messages({
      'any.required': 'Fill in the field',
      'string.empty': 'Fill in the field',
      'string.min': 'Your password must be between 8 - 32 characters long',
      'string.max': 'Your password must be between 8 - 32 characters long',
      'string.pattern.base':
        'Passwords must be 8 characters or more and contain a lowercase letter, an uppercase letter, a number, and a special character.'
    }),
  confirm: defaultVerifyPasswordValidationSettings
})
