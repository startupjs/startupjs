import React, { useState, useMemo } from 'react'
import { ScrollView } from 'react-native'
import { observer } from 'startupjs'
import {
  Span,
  List,
  Item,
  Div
} from '@startupjs/ui'
import Accounts from '../../../components/Accounts'
import Messages from '../../../components//Messages'
import './index.styl'

const TABS = {
  accounts: { label: 'Accounts', value: 'accounts', component: Accounts },
  messages: { label: 'Messages', value: 'messages', component: Messages }
}

function PNotificationDashboard () {
  const [active, setActive] = useState(TABS.accounts.value)

  const Tab = useMemo(() => {
    return TABS[active].component
  }, [active])

  const tabs = useMemo(() => {
    return Object.keys(TABS)
  }, [])

  return pug`
    ScrollView
      Div.root
        List.tabs(variant='horizontal' activeBorder='bottom')
          each tab in tabs
            - const tabValue = TABS[tab].value
            Item.tab(
              key=tabValue
              active= active === tabValue
              onPress=() => setActive(tabValue)
            )
              Span.tabLabel= TABS[tab].label

        Div.content
          Tab
  `
}

export default observer(PNotificationDashboard)
