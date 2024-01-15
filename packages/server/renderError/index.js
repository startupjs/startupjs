import url from 'url'
import path from 'path'
import template from 'lodash/template.js'
import fs from 'fs'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

const templates = {
  403: template(fs.readFileSync(path.join(dirname, 'views/403.html'))),
  404: template(fs.readFileSync(path.join(dirname, 'views/404.html'))),
  500: template(fs.readFileSync(path.join(dirname, 'views/500.html')))
}

// Override/extend default error pages
// each template should be named in that way: <error_code>.html
const readFilesFromDir = dirPath => {
  fs.readdirSync(dirPath).forEach(file => {
    const fileName = file.split('.').shift()
    // Check that file name starts with error_code
    if (Number.isNaN(fileName)) return null
    const fileContent = template(fs.readFileSync(path.join(dirPath, file)))
    templates[fileName] = fileContent
  })
}

export default (options = {}) => {
  if (options.errorPagesPath) {
    readFilesFromDir(path.join(options.dirname, options.errorPagesPath))
  }

  return (err, req, res, next) => {
    console.log(err.stack ? err.stack : err)

    if ((err.name === 'MongoError') && (err.message === 'no primary server available')) {
      setTimeout(() => {
        console.log("EXIT because of 'no primary server available'")
        process.exit()
      }, 1000)
    }

    // Customize error handling here
    const message = err.message || err.toString()
    let status = parseInt(message)
    status = (status >= 400 && status < 600) ? status : 500

    if (status === 403 || status === 404 || status === 500) {
      if (status === 403 && !req.session.loggedIn) {
        res.cookie('redirectWhen', 'loggedIn', { maxAge: 1000 * 3600 })
        res.cookie('redirect', req.url, { maxAge: 1000 * 3600 })
        res.redirect(options.loginUrl || '/')
      } else {
        res.status(status).send(templates[status]({
          url: req.url
        }))
      }
    } else {
      if (!res.finished) res.sendStatus(status)
    }
  }
}
