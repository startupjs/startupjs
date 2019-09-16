const path = require('path')
const _ = require('lodash')
const fs = require('fs')

let templates = {
  '403': _.template(fs.readFileSync(path.join(__dirname, 'views/403.html'))),
  '404': _.template(fs.readFileSync(path.join(__dirname, 'views/404.html'))),
  '500': _.template(fs.readFileSync(path.join(__dirname, 'views/500.html')))
}
let style = fs.readFileSync(path.join(__dirname, 'styles/index.css'))

module.exports = (options = {}) => {
  return (err, req, res, next) => {
    console.log(err.stack ? err.stack : err)

    if ((err.name === 'MongoError') && (err.message === 'no primary server available')) {
      setTimeout(() => {
        console.log("EXIT because of 'no primary server available'")
        process.exit()
      }, 1000)
    }

    // Customize error handling here
    let message = err.message || err.toString()
    let status = parseInt(message)
    status = (status >= 400 && status < 600) ? status : 500

    if (status === 403 || status === 404 || status === 500) {
      if (status === 403 && !req.session.loggedIn) {
        res.cookie('redirectWhen', 'loggedIn', { maxAge: 1000 * 3600 })
        res.cookie('redirect', req.url, { maxAge: 1000 * 3600 })
        res.redirect(options.loginUrl || '/')
      } else {
        res.status(status).send(templates[status]({
          url: req.url,
          style: style
        }))
      }
    } else {
      if (!res.finished) res.sendStatus(status)
    }
  }
}
