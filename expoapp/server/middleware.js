import { $ } from 'startupjs'

export default [helloFromServer]

function helloFromServer (req, res, next) {
  // TODO: this sets it for the SAME whole $ root object, not for the specific request
  //       So it works completely incorrectly now and has to be refactored to use
  //       user-specific $
  $.session.serverHello.set('Hello from server middleware!')
  next()
}
