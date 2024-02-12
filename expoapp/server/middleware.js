export default [helloFromServer]

function helloFromServer (req, res, next) {
  req.model.set('_session.serverHello', 'Hello from server middleware!')
  next()
}
