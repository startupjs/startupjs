import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Div, TextInput, Button, Row } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { useProviders } from '../../hooks'
import { send } from '../../helpers'
import ProvidersList2fa from '../ProvidersList2fa'
import './index.styl'

const PROVIDERS_WITHOUT_SEND = ['google-authenticator']

function ProvidersBlock ({ providerNames, onSubmit }) {
  let providers = useProviders()
  if (providerNames) {
    providers = providers.filter(provider => providerNames.includes(provider))
  }

  const [isSended, setIsSended] = useState(false)

  const [selectedProvider, setSelectedProvider] = useState('')

  const [code, setCode] = useState('')

  function submit () {
    onSubmit({ selectedProvider, code })
  }

  function onSend () {
    send(selectedProvider)
    setIsSended(true)
  }

  return pug`
    Div.root
      if !selectedProvider
        ProvidersList2fa(providers=providers chooseProvider=setSelectedProvider)
      else
        TextInput(
          value=code
          onChangeText=setCode
        )
        Row.row(vAlign='center')
          if isSended || PROVIDERS_WITHOUT_SEND.includes(selectedProvider)
            Button.sendButton(onPress=submit) Check
          else
            Button.sendButton(onPress=onSend) Send
          Button.sendButton(onPress=() =>setSelectedProvider('')) Back
  `
}

ProvidersBlock.propTypes = {
  providerNames: PropTypes.array,
  onSubmit: PropTypes.func
}

export default observer(ProvidersBlock)
