import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Div, TextInput, Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { useProviders } from '../../hooks'
import ProvidersList2fa from '../ProvidersList2fa'
import './index.styl'

function ProvidersBlock ({ providerNames, onSubmit }) {
  let providers = useProviders()
  if (providerNames) {
    providers = providers.filter(provider => providerNames.includes(provider))
  }

  const [selectedProvider, setSelectedProvider] = useState('')

  const [code, setCode] = useState('')

  return pug`
    Div.root
      if !selectedProvider
        ProvidersList2fa(providers=providers chooseProvider=setSelectedProvider)
      else
        TextInput(
          value=code
          onChangeText=setCode
        )
        Button.sendButton(onPress=() => onSubmit({ selectedProvider, code })) Check

  `
}

ProvidersBlock.propTypes = {
  providerNames: PropTypes.array,
  onSubmit: PropTypes.func
}

export default observer(ProvidersBlock)
