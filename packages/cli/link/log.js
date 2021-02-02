const colors = {
  HEADER: '\x1b[95m',
  OKBLUE: '\x1b[94m',
  OKGREEN: '\x1b[92m',
  WARNING: '\x1b[93m',
  FAIL: '\x1b[91m',
  ENDC: '\x1b[0m',
  BOLD: '\x1b[1m',
  UNDERLINE: '\x1b[4m'
}

const log = (text) => process.stdout.write(text)
const logn = (text) => process.stdout.write(text ? text + '\n' : '\n')
const warn = (text) => process.stdout.write(`${colors.WARNING}${text}${colors.ENDC}`)
const warnn = (text) => warn(text ? text + '\n' : '\n')
const error = (text) => process.stdout.write(`${colors.FAIL}${text}${colors.ENDC}`)
const errorn = (text) => error(text ? text + '\n' : '\n')
const info = (text) => process.stdout.write(`${colors.OKGREEN}${text}${colors.ENDC}`)
const infon = (text) => info(text ? text + '\n' : '\n')
const debug = (text) => process.stdout.write(`${colors.OKBLUE}${text}${colors.ENDC}`)
const debugn = (text) => debug(text ? text + '\n' : '\n')

module.exports = {
  log,
  logn,
  warn,
  warnn,
  info,
  infon,
  debug,
  debugn,
  errorn
}
