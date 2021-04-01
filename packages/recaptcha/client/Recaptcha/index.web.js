import React, { useEffect, useState, useImperativeHandle } from 'react'
import { observer, useSession } from 'startupjs'
import PropTypes from 'prop-types'

const isReady = () => Boolean(typeof window === 'object' && window.grecaptcha && window.grecaptcha.render)

function RecaptchaComponent ({
  id,
  theme,
  variant,
  lang,
  onVerify,
  onExpire,
  onError,
  onClose,
  onLoad
}, ref) {
  const [ready, setReady] = useState(isReady())
  const [readyInterval, setReadyInterval] = useState()
  const [recaptchaSiteKey] = useSession('Recaptcha.RECAPTCHA_SITE_KEY')
  let onCloseObserver, widget

  useImperativeHandle(ref, () => ({
    open: () => {
      onClose && _registerOnCloseListener()
      variant === 'invisible' && window.grecaptcha.execute(widget)
    },
    close: () => {
      variant === 'invisible' && window.grecaptcha.reset(widget)
    }
  }))

  useEffect(() => {
    if (!ready) {
      setReadyInterval(setInterval(_updateReadyState, 1000))
    }
  }, [])

  useEffect(() => {
    if (!_isRendered() && ready) {
      _renderRecaptcha()
    }
  }, [ready])

  useEffect(() => {
    return () => {
      if (readyInterval) {
        clearInterval(readyInterval)
      }
      if (onCloseObserver) {
        onCloseObserver.disconnect()
      }
      if (_isRendered()) {
        window.grecaptcha.reset(widget)
      }
    }
  }, [readyInterval])

  const _renderRecaptcha = () => {
    widget = window.grecaptcha.render(id, {
      sitekey: recaptchaSiteKey,
      size: variant,
      theme,
      hl: lang,
      callback: onVerify,
      'expired-callback': onExpire,
      'error-callback': onError
    })
    if (onLoad) {
      onLoad()
    }
  }

  const _updateReadyState = () => {
    if (isReady()) {
      clearInterval(readyInterval)
      setReady(true)
    }
  }

  const _isRendered = () => typeof widget === 'number'

  const _registerOnCloseListener = () => {
    if (onCloseObserver) {
      onCloseObserver.disconnect()
    }

    const iframes = document.getElementsByTagName('iframe')
    const recaptchaFrame = Array.prototype.find
      .call(iframes, e => e.src.includes('google.com/recaptcha/api2/bframe'))
    const recaptchaElement = recaptchaFrame.parentNode.parentNode

    let lastOpacity = recaptchaElement.style.opacity
    onCloseObserver = new MutationObserver(() => {
      if (lastOpacity !== recaptchaElement.style.opacity &&
                recaptchaElement.style.opacity == 0) { // eslint-disable-line
        onClose()
      }
      lastOpacity = recaptchaElement.style.opacity
    })
    onCloseObserver.observe(recaptchaElement, {
      attributes: true,
      attributeFilter: ['style']
    })
  }

  return pug`
    span(id=id)
  `
}

const Recaptcha = observer(RecaptchaComponent, { forwardRef: true })

Recaptcha.defaultProps = {
  id: 'recaptcha',
  theme: 'light',
  variant: 'invisible',
  lang: 'en'
}

Recaptcha.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
  variant: PropTypes.oneOf(['invisible', 'normal', 'compact']),
  lang: PropTypes.string,
  onVerify: PropTypes.func,
  onExpire: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func,
  onLoad: PropTypes.func
}

export default Recaptcha
