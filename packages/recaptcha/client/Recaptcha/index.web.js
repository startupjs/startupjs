import React, { useEffect, useState, useImperativeHandle, useCallback } from 'react'
import { observer } from 'startupjs'
import axios from 'axios'
import PropTypes from 'prop-types'

const isReady = () => Boolean(typeof window === 'object' && window.grecaptcha && window.grecaptcha.render)

function RecaptchaComponent ({
  id,
  theme,
  size,
  siteKey,
  lang,
  onVerify,
  onExpire,
  onError,
  onClose,
  onLoad
}, ref) {
  const [ready, setReady] = useState(isReady())
  const [readyInterval, setReadyInterval] = useState()
  let onCloseObserver, widget

  useImperativeHandle(ref, () => ({
    open: () => {
      onClose && _registerOnCloseListener()
      size === 'invisible' && window.grecaptcha.execute(widget)
    },
    close: () => {
      size === 'invisible' && window.grecaptcha.reset(widget)
    }
  }))

  useEffect(() => {
    if (ready) {
      _renderRecaptcha()
    } else {
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

  const _onVerify = useCallback(async token => {
    const { data } = await axios.post('/api/recaptcha-check-token', { token })
    onVerify && onVerify(data)
  }, [])

  const _renderRecaptcha = () => {
    widget = window.grecaptcha.render(id, {
      sitekey: siteKey,
      size,
      theme,
      hl: lang,
      callback: _onVerify,
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
    onCloseObserver = new MutationObserver(mutations => {
      if (lastOpacity !== recaptchaElement.style.opacity &&
                recaptchaElement.style.opacity == 0) { // eslint-disable-line eqeqeq
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
  size: 'invisible',
  lang: 'en'
}

Recaptcha.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
  size: PropTypes.oneOf(['invisible', 'normal', 'compact']),
  siteKey: PropTypes.string.isRequired,
  lang: PropTypes.string,
  onVerify: PropTypes.func,
  onExpire: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func,
  onLoad: PropTypes.func
}

export default Recaptcha
