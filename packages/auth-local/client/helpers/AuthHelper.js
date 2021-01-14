import axios from 'axios'
import { BASE_URL } from '@env'
import {
  LOCAL_LOGIN_URL,
  CREATE_PASS_RESET_SECRET_URL,
  RESET_PASSWORD_URL,
  REGISTER_URL,
  CHANGE_PASSWORD_URL
} from '../../isomorphic'

export default function AuthHelper (baseUrl) {
  const baseURL = baseUrl || BASE_URL
  this._axios = axios.create({ baseURL })

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
