import React, { useState } from 'react'
import { pug, observer } from 'startupjs'
import { Div, Span, Radio, Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import './index.styl'

function ProvidersList2fa ({ providers, chooseProvider }) {
  const [selectedProvider, setSelectedProvider] = useState('')
  const options = providers.map(provider => ({ label: provider, value: provider }))

  return pug`
    Div.root
      Div.providersBlock
        Span Choose Provider:
        Div.chooseProvider
          Radio(
            options=options
            value=selectedProvider
            onChange=(value) => setSelectedProvider(value)
          )
      Div.buttons
        if selectedProvider
          Button.sendCodeButton(
            onPress=() => chooseProvider(selectedProvider)
          ) Choose
  `
}

ProvidersList2fa.propTypes = {
  providers: PropTypes.array,
  chooseProvider: PropTypes.func
}

export default observer(ProvidersList2fa)
