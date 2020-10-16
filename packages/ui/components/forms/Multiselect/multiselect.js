import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { ScrollView } from 'react-native'
import { Div, Span, Checkbox, Drawer, Br } from '@startupjs/ui'
import MultiselectInput from './input'
import styles from './index.styl'

const Multiselect = ({
  options,
  value,
  placeholder,
  label,
  showOptsMenu,
  hideOptsMenu,
  showOpts,
  tagVariant,
  activeColor,
  disabled,
  error,
  onSelect,
  onRemove
}) => {
  function renderOpt (opt) {
    const selected = value.some(_value => _value === opt.value)
    const selectCb = () => {
      if (selected) {
        onRemove(opt.value)
      } else {
        onSelect(opt.value)
      }
    }
    return pug`
      Div.suggestion(key=opt.value onPress=selectCb)
        Checkbox.checkbox(value=selected onChange=selectCb)
        Span.sugText= opt.label
    `
  }

  return pug`
    MultiselectInput(
      label=label
      showOptsMenu=showOptsMenu
      showOpts=showOpts
      value=value
      placeholder=placeholder
      options=options
      tagVariant=tagVariant
      activeColor=activeColor
      disabled=disabled
      error=error
    )
    Drawer(
      visible=showOpts
      position='bottom'
      onDismiss=hideOptsMenu
      styleSwipe=styles.swipeZone
      styleContent=styles.nativeContent
    )
      ScrollView.suggestions-native
        each opt in options
          = renderOpt(opt)
        //- ???
        Br
        Br
        Br
        Br
        Br

  `
}

Multiselect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  showOptsMenu: PropTypes.func.isRequired,
  hideOptsMenu: PropTypes.func.isRequired,
  showOpts: PropTypes.bool.isRequired,
  tagVariant: PropTypes.string,
  activeColor: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string
}

export default observer(Multiselect)
