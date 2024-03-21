import React from 'react'
import { Platform, Linking } from 'react-native'
import { pug, observer } from 'startupjs'
import useRouter from '@startupjs/utils/useRouter'
import PropTypes from 'prop-types'
import Div from './../Div'
import Button from './../Button'
import Span from './../typography/Span'
import themed from '../../theming/themed'
import './index.styl'

const isWeb = Platform.OS === 'web'
const EXTERNAL_LINK_REGEXP = /^(https?:\/\/|\/\/)/i

// IDEA
// Think about to remove Span, Div properties (variant, bold, italic, etc) and
// to make Link more clear

function Link ({
  style,
  to,
  href, // alias for `to`
  color,
  theme,
  display,
  push,
  replace,
  children,
  onPress,
  ...props
}) {
  if (!display) display = typeof children === 'string' ? 'inline' : 'block'
  if (href) to = href

  const isBlock = display === 'block'
  const Component = isBlock ? Div : Span
  const extraProps = { accessibilityRole: 'link', onPress: handlePress }
  const {
    navigate: routerNavigate,
    push: routerPush,
    replace: routerReplace,
    usePathname
  } = useRouter()

  const pathname = usePathname()

  // full href is needed to generate correct absolute urls
  if (isWeb) {
    let href = to
    // construct correct url for the relative links
    if (!EXTERNAL_LINK_REGEXP.test(href) && !/^[/?#]/.test(href)) {
      let p = pathname
      p = p.replace(/#.*$/, '') // remove trailing hash
      p = p.replace(/\?.*$/, '') // remove trailing query
      p = p.replace(/\/$/, '') // remove trailing slash
      href = href.replace(/^\//, '') // remove leading slash
      href = href.replace(/\/$/, '') // remove trailing slash
      href = p + '/' + href
    }
    extraProps.href = href
  }

  function handlePress (event) {
    if (onPress) onPress(event)

    if (!event.defaultPrevented) {
      if (isWeb) {
        // ignore clicks with modifier keys
        // let browser handle these clicks
        if (isModifiedEvent(event)) return
        // prevent default browser behavior
        // because we need to use a react router
        event.preventDefault()
      }

      if (EXTERNAL_LINK_REGEXP.test(to)) {
        isWeb
          ? window.open(to, '_blank')
          : Linking.openURL(to)
      } else {
        let method
        if (push) method = routerPush
        else if (replace) method = routerReplace
        else method = routerNavigate
        method(to)
      }
    }
  }

  // when children is Button component
  if (isBlock) {
    try {
      // it throws an error if children has more then one child
      React.Children.only(children)
      // originalType is using for component in MDX docs
      if (children.props.originalType === Button || children.type === Button) {
        return React.cloneElement(children, { style, ...props, ...extraProps })
      }
    } catch (e) {}
  }

  return pug`
    Component.root(
      style=style
      styleName=[theme, color, display]
      ...props
      ...extraProps
    )= children
  `
}

function isModifiedEvent (event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

Link.defaultProps = {
  bold: Span.defaultProps.bold,
  italic: Span.defaultProps.italic,
  replace: false,
  color: 'default'
}

Link.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  bold: Span.propTypes.bold,
  italic: Span.propTypes.italic,
  children: PropTypes.node,
  to: PropTypes.string,
  href: PropTypes.string,
  push: PropTypes.bool,
  replace: PropTypes.bool,
  display: PropTypes.oneOf(['inline', 'block']),
  color: PropTypes.oneOf(['default', 'primary'])
}

export default observer(themed('Link', Link))
