import React, { useState } from 'react'
import { observer } from 'startupjs'
import LoginForm from '../LoginForm'
import RecoverForm from '../RecoverForm'
import RegisterForm from '../RegisterForm'

const sections = {
  login: LoginForm,
  register: RegisterForm,
  recover: RecoverForm
}

function AuthForm ({ onError, onSuccess, onHandleError }) {
  const [currentSection, setCurrentSection] = useState('login')
  const Component = sections[currentSection]

  const changeAuthPage = section => () => setCurrentSection(section)

  return pug`
    Component(
      onSuccess=onSuccess
      onError=onError
      onHandleError=onHandleError
      onChangeAuthPage=changeAuthPage
    )
  `
}

export default observer(AuthForm)
