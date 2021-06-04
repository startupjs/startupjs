import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Div, TextInput, Button, Row, Alert, Br } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { useProviders } from '../../hooks'
import { send } from '../../helpers'
import ProvidersList2fa from '../ProvidersList2fa'
import './index.styl'

function ProvidersBlock ({ providerNames, onSubmit }) {
  let providers = useProviders()
  if (providerNames) {
    providers = providers.filter(provider => providerNames.includes(provider))
  }

  const [selectedProvider, setSelectedProvider] = useState()
  const [error, setError] = useState()
  const [code, setCode] = useState('')

  function submit () {
    onSubmit({ selectedProvider, code })
  }

  async function onSend (provider) {
    try {
      await send(provider)
    } catch (err) {
      setError(err)
      setTimeout(() => {
        setError()
      }, 5000)
    }
  }

  function onBack () {
    setSelectedProvider()
    setCode('')
  }

  function chooseProvider (provider) {
    setSelectedProvider(provider)
    onSend(provider)
  }

  return pug`
    Div.root
      if error
        Alert(variant='error') Something went wrong. Try again in 5 minutes
        Br
      if !selectedProvider
        ProvidersList2fa(providers=providers chooseProvider=chooseProvider)
      else
        TextInput(
          value=code
          onChangeText=setCode
        )
        Row.row(vAlign='center')
          Button(onPress=submit) Check
          Button(onPress=onBack) Back
  `
}

ProvidersBlock.propTypes = {
  providerNames: PropTypes.array,
  onSubmit: PropTypes.func
}

export default observer(ProvidersBlock)
