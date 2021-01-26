import React from 'react'
import { Linking } from 'react-native'
import { observer, useSession } from 'startupjs'
import { Card, H3, H5, Span, Button, Div } from '@startupjs/ui'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function ErrorTemplate ({ title, description, isSupportEmailBlock, goBack }) {
  const [{ supportEmail } = {}] = useSession('criticalVersion.meta')

  return pug`
    Div.root
      Card.card
        H3.info= title
        H5= description
        if supportEmail && isSupportEmailBlock
          Span &nbsp;at&nbsp;
          Span.email(onPress=() => Linking.openURL('mailto:' + supportEmail))= supportEmail
          Span .

        Button.backButton(icon=faArrowLeft onPress=goBack) Go back

  `
})
