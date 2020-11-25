import { $root } from 'startupjs'
import axios from 'axios'
import {
  LOCAL_LOGIN_URL,
  CREATE_PASS_RESET_SECRET_URL,
  RESET_PASSWORD_URL,
  REGISTER_URL,
  CHANGE_PASSWORD_URL
} from '../../isomorphic'

export default function AuthHelper () {
  // You must make BASE_URL as bublic in config.json
  // Just pass BASE_URL key to "PUBLIC" prop array
  // ...
  // "PUBLIC": ["BASE_URL"]
  // ...
  const baseUrl = $root.get('_session.env.BASE_URL')
  this._axios = axios.create({ baseUrl })

  // data: { email, password }
  this.login = function (data) {
    return this._axios.post(LOCAL_LOGIN_URL, data)
  }

  // request for change password for email
  // data: { email }
  this.createPassResetSecret = function (data) {
    return this._axios.post(CREATE_PASS_RESET_SECRET_URL, data)
  }

  // submit secret and new password
  // data: { password, confirm, secret }
  this.resetPassword = function (data) {
    return this._axios.post(RESET_PASSWORD_URL, data)
  }

  // chang password for current user (you must be logged in, userId will be taken from session)
  // data: { password, confirm, oldPassword }
  this.changePassword = function (data) {
    return this._axios.post(CHANGE_PASSWORD_URL, data)
  }

  // data: { email, password, confirm, userData(firstName, lastName, ...) }
  this.register = function (data) {
    return this._axios.post(REGISTER_URL, data)
  }
}
