import Joi from '@hapi/joi'

export const getValidationSchema = ({ passwordCheckType }) => {
  const defaultPasswordRules = Joi.string().required()
    .min(8)
    .max(32)
    .messages({
      'any.required': 'Fill in the field',
      'string.empty': 'Fill in the field',
      'string.min': 'Your password must be between 8 - 32 characters long',
      'string.max': 'Your password must be between 8 - 32 characters long'
    })

  const complexPasswordRules = defaultPasswordRules
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&#$^])[A-Za-z\d_@$!%*-?&#^]{8,}$/)
    .messages({
      'string.pattern.base':
        'Passwords must be 8 characters or more and contain a lowercase letter, an uppercase letter, a number, and a special character.'
    })

  const getPasswordRules = () => {
    switch (passwordCheckType) {
      case 'complex':
        return complexPasswordRules
      case 'simple':
      default:
        return defaultPasswordRules
    }
  }

  const commonSchema = Joi.object().keys({
    name: Joi.string().required()
      .regex(/^.+\s.+$/)
      .messages({
        'any.required': 'Fill in the field',
        'string.empty': 'Fill in the field',
        'string.pattern.base': 'Please enter your full name'
      }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .required()
      .messages({
        'any.required': 'Fill in the field',
        'string.empty': 'Fill in the field',
        'string.email': 'Invalid email'
      }),
    password: getPasswordRules(),
    confirm: Joi.string().required()
      .valid(Joi.ref('password'))
      .messages({
        'any.required': 'Fill in the field',
        'string.empty': 'Fill in the field',
        'any.only': 'Passwords do not match'
      })
  })

  return commonSchema
}
