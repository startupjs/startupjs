import React, { useState } from 'react'
import { observer } from 'startupjs'
import { H3, Content, Span } from '@startupjs/ui'
import { View } from 'react-native'
import _clodeDeep from 'lodash/cloneDeep'
import PropTypes from 'prop-types'
import './index.styl'

const CAPTIONS = {
  'sign-in': 'Sign In',
  'sign-up': 'Sign Up',
  recover: 'Forgot password'
}

const LOCAL_COMPONENTS = {
  'sign-in': 'LoginForm',
  'sign-up': 'RegisterForm',
  recover: 'RecoverForm'
}

function AuthForm ({
  initSlide,
  components,
  hasRouting,
  onSuccess,
  onError,
  onHandleError
}) {
  const [activeSlide, setActiveSlide] = useState(initSlide)
  let hasLocalStategy = false

  let _components = _clodeDeep(components)
  _components = _components.sort(a => {
    return a.toString() === '[object Module]' ? 1 : -1
  })

  const renderComponents = _components.map((item, index) => {
    if (item.toString() === '[object Module]') {
      const Component = item[LOCAL_COMPONENTS[activeSlide]]
      hasLocalStategy = true

      return pug`
        View.form
          Component(
            key=index
            onSuccess=onSuccess
            onError=onError
            onHandleError=onHandleError
            onChangeAuthPage=hasRouting ? null : setActiveSlide
          )
      `
    }

    if (activeSlide === 'recover') return null

    const Component = item
    return pug`
      View.button
        Component(key=index)
    `
  })

  return pug`
    Content
      if hasLocalStategy
        H3.caption= CAPTIONS[activeSlide]
        Span.desc
      = renderComponents
  `
}

AuthForm.propTypes = {
  initSlide: PropTypes.string,
  components: PropTypes.array,
  hasRouting: PropTypes.bool,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

AuthForm.defaultProps = {
  initSlide: 'sign-in',
  components: [],
  hasRouting: false,
  onSuccess: null,
  onError: null,
  onHandleError: null
}

export default observer(AuthForm)
