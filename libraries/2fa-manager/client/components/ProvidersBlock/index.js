import React, { useState } from 'react'
import { pug, observer } from 'startupjs'
import { Div, TextInput, Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { useProviders } from '../../hooks'
import { send } from '../../helpers'
import { CODES } from './Error/constants'
import Error from './Error'
import ProvidersList2fa from '../ProvidersList2fa'
import './index.styl'

function ProvidersBlock ({ providerNames, onSubmit }) {
  let providers = useProviders()
  if (providerNames) {
    providers = providers.filter(provider => providerNames.includes(provider))
  }

  const [selectedProvider, setSelectedProvider] = useState()
  const [error, setError] = useState()
  const [code, setCode] = useState()

  async function submit () {
    setError()
    const result = await onSubmit({ selectedProvider, code })
    !result && setError(CODES.VERIFICATION_ERR)
  }

  function onBack () {
    setSelectedProvider()
    setCode()
    setError()
  }

  async function chooseProvider (provider) {
    setError()
    try {
      await send(provider)
      setSelectedProvider(provider)
    } catch (err) {
      setError(CODES.SERVER_ERR)
    }
  }

  return pug`
    Div.root
      if error
        Div.error
          Error(errorCode=error)
      if !selectedProvider
        ProvidersList2fa(providers=providers chooseProvider=chooseProvider)
      else
        TextInput(
          value=code
          onChangeText=setCode
        )
        Div.row(vAlign='center' row)
          Button(onPress=submit) Check
          Button(onPress=onBack) Back
  `
}

ProvidersBlock.propTypes = {
  providerNames: PropTypes.array,
  onSubmit: PropTypes.func
}

export default observer(ProvidersBlock)
