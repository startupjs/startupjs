import React, { useEffect, useState, useImperativeHandle } from 'react'
import { observer, useComponentId } from 'startupjs'
import PropTypes from 'prop-types'
import {
  getSiteKey,
  isReady,
  getGrecaptcha,
  getRecaptchaType,
  getIframeUrl
} from '../../helpers'

function RecaptchaComponent ({
  theme,
  badge,
  variant,
  lang,
  onVerify,
  onExpire,
  onError,
  onClose,
  onLoad
}, ref) {
  const [ready, setReady] = useState(isReady())
  const [widget, setWidget] = useState()
  const [readyInterval, setReadyInterval] = useState()
  const id = useComponentId()

  let onCloseObserver

  const grecaptcha = getGrecaptcha()

  useImperativeHandle(ref, () => ({
    open: () => {
      onClose && _registerOnCloseListener()
      variant === 'invisible' && grecaptcha.execute(widget)
    },
    close: () => {
      variant === 'invisible' && grecaptcha.reset(widget)
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
        grecaptcha.reset(widget)
      }
    }
  }, [readyInterval])

  const _renderRecaptcha = () => {
    setWidget(grecaptcha.render(id, {
      sitekey: getSiteKey(variant),
      size: variant,
      theme,
      badge,
      hl: lang,
      callback: token => onVerify({ type: getRecaptchaType(), token, variant }),
      'expired-callback': onExpire,
      'error-callback': onError
    }))
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
      .call(iframes, e => e.src.includes(getIframeUrl()))
    const recaptchaElement = recaptchaFrame.parentNode.parentNode

    let lastOpacity = recaptchaElement.style.opacity
    onCloseObserver = new MutationObserver(() => {
      if (lastOpacity !== recaptchaElement.style.opacity &&
                recaptchaElement.style.opacity == 0) { // eslint-disable-line
        onClose()
      }
      lastOpacity = recaptchaElement.style.opacity
    })
    onCloseObserver && onCloseObserver.observe(recaptchaElement, {
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
  theme: 'light',
  variant: 'invisible',
  lang: 'en'
}

Recaptcha.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']),
  badge: PropTypes.oneOf(['bottomright', 'bottomleft', 'inline']),
  variant: PropTypes.oneOf(['invisible', 'normal', 'compact']),
  lang: PropTypes.string,
  onVerify: PropTypes.func,
  onExpire: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func,
  onLoad: PropTypes.func
}

export default Recaptcha
