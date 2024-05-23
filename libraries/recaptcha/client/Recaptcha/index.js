import React, { useImperativeHandle, useState, useCallback, useRef, useMemo } from 'react'
import WebView from 'react-native-webview'
import { Modal } from 'react-native'
import { pug, observer, useComponentId } from 'startupjs'
import { Div, Loader } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { BASE_URL } from '@env'
import { getSiteKey, getRecaptchaType } from '../../helpers'
import getTemplate from './get-template'
import './index.styl'

const originWhitelist = ['*']

function RecaptchaComponent ({
  style,
  theme,
  badge,
  variant,
  baseUrl,
  lang,
  onVerify,
  onExpire,
  onError,
  onClose,
  onLoad
}, ref) {
  const isClosedRef = useRef(true)
  const webViewRef = useRef()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const id = useComponentId()

  const isInvisible = variant === 'invisible'

  const html = useMemo(() => {
    return getTemplate({
      siteKey: getSiteKey(),
      variant,
      theme,
      badge,
      lang,
      id
    })
  }, [variant, theme, lang, id])

  const handleLoad = useCallback(
    (...args) => {
      onLoad && onLoad(...args)

      if (isInvisible) {
        webViewRef.current.injectJavaScript(`
            window.rnRecaptcha.execute();
          `)
      }

      setLoading(false)
    },
    [onLoad, isInvisible]
  )

  const handleClose = useCallback(
    (...args) => {
      if (isClosedRef.current) {
        return
      }
      isClosedRef.current = true
      setVisible(false)
      onClose && onClose(...args)
    },
    [onClose]
  )

  const handleMessage = useCallback(
    async (content) => {
      try {
        const payload = JSON.parse(content.nativeEvent.data)
        if (payload.close) {
          handleClose()
        }
        if (payload.load) {
          handleLoad(...payload.load)
        }
        if (payload.expire) {
          onExpire && onExpire(...payload.expire)
        }
        if (payload.error) {
          handleClose()
          onError && onError(...payload.error)
        }
        if (payload.verify) {
          handleClose()
          onVerify && onVerify({
            type: getRecaptchaType(),
            token: payload.verify[0],
            variant
          })
        }
      } catch (err) {
        console.warn(err)
      }
    },
    [onVerify, onExpire, onError, handleClose, handleLoad, isInvisible]
  )

  const source = useMemo(
    () => ({
      html,
      baseUrl
    }),
    [html, baseUrl]
  )

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true)
      setLoading(true)
      isClosedRef.current = false
    },
    close: handleClose
  }), [handleClose])

  const handleNavigationStateChange = useCallback(() => {
    // prevent navigation on Android
    if (!loading) {
      webViewRef.current.stopLoading()
    }
  }, [loading])

  const handleShouldStartLoadWithRequest = useCallback(event => {
    // prevent navigation on iOS
    return event.navigationType === 'other'
  }, [loading])

  const renderLoading = () => {
    if (!loading && source) return null

    return pug`
      Div.loading
        Loader(size='m')
    `
  }

  return pug`
    Modal(
      visible=visible
      onRequestClose=handleClose
      transparent
    )
      WebView.webView(
        ref=webViewRef
        originWhitelist=originWhitelist
        source=source
        style=style
        onMessage=handleMessage
        allowsBackForwardNavigationGestures=false
        onShouldStartLoadWithRequest=handleShouldStartLoadWithRequest
        onNavigationStateChange=handleNavigationStateChange
        bounces=false
      )
      = renderLoading()
  `
}

const Recaptcha = observer(RecaptchaComponent, { forwardRef: true })

Recaptcha.defaultProps = {
  theme: 'light',
  variant: 'invisible',
  baseUrl: BASE_URL || '',
  lang: 'en'
}

Recaptcha.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  theme: PropTypes.oneOf(['light', 'dark']),
  badge: PropTypes.oneOf(['bottomright', 'bottomleft', 'inline']),
  variant: PropTypes.oneOf(['invisible', 'normal', 'compact']),
  lang: PropTypes.string,
  baseUrl: PropTypes.string,
  onVerify: PropTypes.func,
  onExpire: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func,
  onLoad: PropTypes.func
}

export default Recaptcha
