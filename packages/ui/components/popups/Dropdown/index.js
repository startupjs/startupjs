import React, { useRef } from 'react'
import { observer, useValue } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../Div'
import Drawer from '../Drawer'
import AbstractPopover from '../../AbstractPopover'
import AbstractDropdown from '../../AbstractDropdown'
import { useScroll } from '../../AbstractDropdown/helpers'
import DeprecatedDropdown from './Deprecated'
import Menu from '../../Menu'
import './index.styl'

const _Dropdown = observer(({
  style,
  value,
  children,
  onChange,
  ...props
}) => {
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

  return pug`
    Dropdown(
      ...props
      style=style
      value=value
      onChange=onChange
    )= children
  `
})

const Dropdown = observer(({
  style,
  children,
  value,
  options,
  popoverOnly,
  popoverProps,
  drawerProps,
  onChange
}) => {
  const refAnchor = useRef()
  const refDropdown = useRef()

  const [visible, $visible] = useValue(false)
  const [selectIndex, $selectIndex] = useValue(-1)

  const { scrollToActive, getItemLayout, onLayoutItem } = useScroll({
    value,
    ref: refDropdown,
    data: options
  })

  function _onChange (value) {
    onChange(value)
    $visible.set(false)
    $selectIndex.set(-1)
  }

  function renderItem ({ item, index }) {
    console.log(item)
    return pug`
      Menu.Item(
        to=item.to
        icon=item.icon
        active=value === item.value
        styleName={ selectItem: index === selectIndex }
        onLayout=e=> onLayoutItem(e, index)
        onPress=()=> item.onPress ? item.onPress() : _onChange(item.value)
      )= item.label
    `
  }

  return pug`
    Div.anchor(
      style=style
      ref=refAnchor
      onPress=()=> $visible.set(true)
    )= children
    AbstractDropdown(
      ref=refDropdown
      refAnchor=refAnchor
      visible=visible
      data=options
      extraData={ selectIndex }
      renderItem=renderItem
      popoverOnly=popoverOnly
      popoverProps=popoverProps
      drawerProps=drawerProps
      getItemLayout=getItemLayout
      onEnterIndex=index=> _onChange(options[index].value)
      onSelectIndex=index=> $selectIndex.set(index)
      onRequestOpen=scrollToActive
      onChangeVisible=v=> $visible.set(v)
    )
  `
})

_Dropdown.defaultProps = {
  value: '',
  popoverOnly: false,
  popoverProps: {
    position: 'bottom',
    attachment: 'start',
    placements: AbstractPopover.defaultProps.placements
  },
  drawerProps: {
    position: 'bottom'
  }
}

_Dropdown.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  popoverOnly: PropTypes.bool,
  popoverProps: PropTypes.shape({
    position: AbstractPopover.propTypes.position,
    attachment: AbstractPopover.propTypes.attachment,
    placements: AbstractPopover.propTypes.placements
  }),
  drawerProps: PropTypes.shape({
    position: Drawer.propTypes.position
  }),
  onChange: PropTypes.func
}

_Dropdown.Caption = DeprecatedDropdown.Caption
_Dropdown.Item = DeprecatedDropdown.Item

export default _Dropdown
