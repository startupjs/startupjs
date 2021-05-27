import React, { useState } from 'react'
import { observer } from 'startupjs'
import {
  Menu,
  Span,
  Div
} from '@startupjs/ui'
import Accounts from '../../../components/Accounts'
import Messages from '../../../components//Messages'
import './index.styl'

const TABS = {
  accounts: 'Accounts',
  messages: 'Messages'
}

function PNotificationDashboard () {
  const [active, setActive] = useState(TABS.accounts)
  return pug`
    Menu.menu(variant='horizontal' activeBorder='bottom')
      each tab in Object.keys(TABS)
        Menu.Item.menuItem(
          key=TABS[tab]
          active= active === TABS[tab]
          onPress=() => setActive(TABS[tab])
        )
          Span= TABS[tab]

    Div.content
      case active 
        when TABS.accounts
          Accounts
        when TABS.messages
          Messages
  `
}

export default observer(PNotificationDashboard)
