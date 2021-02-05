import AccessDeny from './AccessDeny'
import DefaultError from './DefaultError'

export const defaultTemplates = {
  403: AccessDeny,
  default: DefaultError
}

export { default as ErrorTemplate } from './ErrorTemplate'
