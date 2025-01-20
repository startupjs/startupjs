import * as constants from './constants.js'

export default function getParam (param) {
  return process.env[param] != null ? process.env[param] : constants[param]
}
