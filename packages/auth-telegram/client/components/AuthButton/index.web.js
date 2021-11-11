import React, { useEffect, useRef } from 'react'
import { observer } from 'startupjs'
import { TELEGRAM_LOGIN } from '@env'

function AuthButton () {
  const containerRef = useRef()

  useEffect(function () {
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?15'
    script.setAttribute('data-telegram-login', TELEGRAM_LOGIN)
    script.setAttribute('data-size', 'medium')
    script.setAttribute('data-radius', '4')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-userpic', 'false')
    script.setAttribute('data-auth-url', '/auth/telegram')
    script.async = true
    containerRef.current.append(script)
  }, [])

  return pug`
    div(ref=containerRef)
  `
}

export default observer(AuthButton)
