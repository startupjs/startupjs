import React, { useState, useEffect } from 'react'
import { observer } from 'startupjs'
import codePush from 'react-native-code-push'
import { Layout } from './components'
import { AppState, View, Text } from 'react-native'
import get from 'lodash/get'
import App from './App'
import './index.styl'

const NativeApp = observer(function (props) {
  const [progress, setProgress] = useState()
  const [loading, setLoading] = useState()
  let appStateStore = ''

  useEffect(() => {
    checkForUpdate()
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  function handleAppStateChange (nextAppState) {
    if (
      appStateStore.match(/inactive|background/) && nextAppState === 'active'
    ) {
      checkForUpdate()
    }
    appStateStore = nextAppState
  }

  function codePushStatusDidChange (syncStatus) {
    switch (syncStatus) {
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        setLoading(true)
        break
      case codePush.SyncStatus.UNKNOWN_ERROR:
        setLoading(false)
        // alert ??
    }
  }

  function codePushDownloadDidProgress (progress) {
    setProgress(progress)
  }

  async function checkForUpdate () {
    const res = await codePush.checkForUpdate()
    if (!res) return
    if (res.isMandatory) {
      codePush.sync(
        { installMode: codePush.InstallMode.IMMEDIATE, updateDialog: true },
        codePushStatusDidChange,
        codePushDownloadDidProgress
      )
    } else {
      codePush.sync({ installMode: codePush.InstallMode.ON_NEXT_SUSPEND })
    }
  }

  const title = pug`
    Text Installing update.
    Text= '\n'
    Text.wait Please wait
  `

  return pug`
    if loading
      - const receivedBytes = get(progress, 'receivedBytes', 0)
      - const totalBytes = get(progress, 'totalBytes', 1)
      - const percent = (receivedBytes * 100 / totalBytes) ^ 0
      Layout(
        title=title
      )
        View.progress
          Text.percent= percent + '%'
          View.bar
            View.filler(style={width: percent + '%'})
    else
      App(...props)
  `
})

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL
}

export default codePush(codePushOptions)(NativeApp)
