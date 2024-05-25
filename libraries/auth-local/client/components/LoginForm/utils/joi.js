import Joi from '@hapi/joi'

export default Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
    .messages({
      'any.required': 'Fill in the field',
      'string.empty': 'Fill in the field',
      'string.email': 'Invalid email'
    }),
  password: Joi.string().required()
    .min(3)
    .max(32)
    .messages({
      'any.required': 'Fill in the field',
      'string.empty': 'Fill in the field',
      'string.min': 'Your password must be between 8 - 32 characters long',
      'string.max': 'Your password must be between 8 - 32 characters long'
    })
})
