import React from 'react'
import propTypes from 'prop-types'

function PluginsProvider ({ plugins, children }) {
  return plugins.reduce(renderWrapper, children)
}

function renderWrapper (children, plugin) {
  if (!plugin.initWrapper) return children
  const Wrapper = plugin.initWrapper

  return pug`
    Wrapper= children
  `
}

PluginsProvider.defaultProps = {
  plugins: []
}

PluginsProvider.propTypes = {
  plugins: propTypes.array,
  children: propTypes.node
}

export default (PluginsProvider)
