// import { $ } from 'startupjs'

export default [helloFromServer]

function helloFromServer (req, res, next) {
  // TODO: this sets it for the SAME whole $ root object, not for the specific request
  //       So it works completely incorrectly now and has to be refactored to use
  //       user-specific $
  //       Right now there is an explicit prohibition of setting private collections data on server in teamplay
  // $.session.serverHello.set('Hello from server middleware!')
  next()
}
