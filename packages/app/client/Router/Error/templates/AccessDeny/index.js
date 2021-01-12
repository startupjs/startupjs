import React from 'react'
import { Linking } from 'react-native'
import { observer, useSession } from 'startupjs'
import { Card, H3, H5, Span, Button } from '@startupjs/ui'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Layout from '../../../../components/Layout'
import './index.styl'

export default observer(function AccessDeny ({ disableError }) {
  const [{ supportEmail } = {}] = useSession('criticalVersion.meta')

  return pug`
    Layout(
      center
    )
      Card.card
        H3.info 403: Permission denied
        H5 If you think it's a mistake, please contact support
        if supportEmail
          Span &nbsp;at&nbsp;
          Span.email(onPress=() => Linking.openURL('mailto:' + supportEmail))= supportEmail
          Span .

        Button.backButton(icon=faArrowLeft onPress=disableError) Go back

  `
})
