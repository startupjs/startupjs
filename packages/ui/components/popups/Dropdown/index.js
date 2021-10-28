import React, { useRef } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../Div'
import Drawer from '../Drawer'
import AbstractPopover from '../../AbstractPopover'
import AbstractDropdown from '../../AbstractDropdown'
import DeprecatedDropdown from './Deprecated'

function Dropdown ({
  style,
  value,
  children,
  onChange,
  ...props
}, ref) {
  if (React.Children.toArray(children).find(child => child.type === DeprecatedDropdown.Item)) {
    console.warn('[@startupjs/ui] Dropdown: Dropdown.Item is DEPRECATED, use new api')

    return pug`
      DeprecatedDropdown(
        ...props
        style=style
        value=value
        onChange=onChange
      )= children
    `
  }

  const refAnchor = useRef()
  const refDropdown = useRef()

  return pug`
    Div(
      ref=refAnchor
      onPress=()=> refDropdown.current.open()
    )= children
    AbstractDropdown(
      ...props
      ref=refDropdown
      refAnchor=refAnchor
      value=value
      onChange=onChange
    )
  `
}

const ObservedDropdown = observer(Dropdown, { forwardRef: true })

ObservedDropdown.defaultProps = {
  value: '',
  popoverOnly: false,
  popoverProps: {
    position: 'bottom',
    attachment: 'start',
    placements: AbstractPopover.defaultProps.placements
  },
  drawerProps: {
    position: 'bottom',
    listTitle: 'Select value'
  }
}

ObservedDropdown.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  popoverOnly: PropTypes.bool,
  popoverProps: PropTypes.shape({
    position: AbstractPopover.propTypes.position,
    attachment: AbstractPopover.propTypes.attachment,
    placements: AbstractPopover.propTypes.placements
  }),
  drawerProps: PropTypes.shape({
    position: Drawer.propTypes.position,
    listTitle: PropTypes.string
  }),
  onChange: PropTypes.func
}

ObservedDropdown.Caption = DeprecatedDropdown.Caption
ObservedDropdown.Item = DeprecatedDropdown.Item

export default ObservedDropdown
