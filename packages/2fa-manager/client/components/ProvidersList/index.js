import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Div, Span, Radio, Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import './index.styl'

function ProvidersList ({ providers, chooseProvider }) {
  const [selectedProvider, setSelectedProvider] = useState('')

  return pug`
    Div.root
      Div.providersBlock
        Span Choose Provider:
        Div.chooseProvider
          Radio(
            value=selectedProvider
            onChange=(value) => setSelectedProvider(value)
          )
            each provider in providers
              Radio.Item(
                key=provider
                value=provider
              )
                Span= provider
      Div.buttons
        if selectedProvider
          Button.sendCodeButton(
            onPress=() => chooseProvider(selectedProvider)
          ) Choose
  `
}

ProvidersList.propTypes = {
  providers: PropTypes.array,
  chooseProvider: PropTypes.func
}

export default observer(ProvidersList)
