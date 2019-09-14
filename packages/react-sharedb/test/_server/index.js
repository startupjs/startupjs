import { fork } from 'child_process'

before(function (done) {
  this.timeout(10000)
  const server = fork(__dirname + '/_init.js', [], { silent: true })
  server.stdout.pipe(process.stdout)
  server.stderr.pipe(process.stderr)
  process.on('exit', () => server.kill())
  server.on('message', ({ type, err } = {}) => {
    if (type !== 'done') return
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
      done()
    }
  })
})
