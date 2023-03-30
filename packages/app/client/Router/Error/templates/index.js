import AccessDeny from './AccessDeny'
import DefaultError from './DefaultError'
import NotFound from './NotFound'

export const defaultTemplates = {
  403: AccessDeny,
  404: NotFound,
  default: DefaultError
}

export { default as ErrorTemplate } from './ErrorTemplate'
