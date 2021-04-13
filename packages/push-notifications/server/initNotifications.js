import routes from './routes'

export default function (ee, options) {
  ee.on('routes', routes)
}
