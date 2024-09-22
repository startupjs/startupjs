import React, { useState, useEffect } from 'react'
import { Image } from 'react-native'
import { pug, observer } from 'startupjs'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { getSecret } from '../../helpers'
import './index.styl'

function QRSecret ({ style }) {
  const [secret, setSecret] = useState({})

  useEffect(() => {
    async function getQR () {
      try {
        const _secret = await getSecret()
        setSecret(_secret)
      } catch (err) {
        console.error(err)
      }
    }
    getQR()
  })

  return pug`
    Div(style=style)
      if secret
        Image.image(
          source={ uri: secret.QRDataURL }
        )
  `
}

QRSecret.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

export default observer(QRSecret)
