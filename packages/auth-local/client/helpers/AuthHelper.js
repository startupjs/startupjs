import axios from 'axios'
import { LOCAL_LOGIN_URL, CREATE_PASS_RESET_SECRET_URL } from '../../isomorphic'
import { $root } from 'startupjs'

export default function AuthHelper () {
  // You must make BASE_URL as bublic in config.json
  // Just pass BASE_URL key to "PUBLIC" prop array
  // ...
  // "PUBLIC": ["BASE_URL"]
  // ...
  const baseUrl = $root.get('_session.env.BASE_URL')
  this._axios = axios.create({ baseURL: baseUrl })

  this.login = function (data) {
    return this._axios.post(LOCAL_LOGIN_URL, data)
  }

  // request for change password for email
  this.createPassResetSecret = function (data) {
    return this._axios.post(CREATE_PASS_RESET_SECRET_URL, data)
  }
}
