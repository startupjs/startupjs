import React, { useState, useEffect } from 'react'
import { observer } from 'startupjs'
import { Modal } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { getProviders } from '../../helpers'

function TwoFAModal ({
  renderContent,
  ...props
}) {
  const [providers, setProviders] = useState([])

  useEffect(() => {
    async function _getProviders () {
      const _providers = await getProviders()
      setProviders(_providers)
    }
    _getProviders()
  }, [])

  return pug`
    Modal(
      ...props
    )
      =renderContent(providers)
  `
}

TwoFAModal.propTypes = {
  renderContent: PropTypes.func
}

export default observer(TwoFAModal)
