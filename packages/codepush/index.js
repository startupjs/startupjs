import React, { useState, useEffect } from 'react'
import codePush from 'react-native-code-push'
import { AppState, View, Text } from 'react-native'
import get from 'lodash/get'

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL
}

export default codePush(codePushOptions)(function CodePushApp (Component) {
  const [appStateStore, setAppStateStore] = useState('')
  const [progress, setProgress] = useState()
  const [loading, setLoading] = useState()

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
    setAppStateStore(nextAppState)
  }

  function codePushStatusDidChange (syncStatus) {
    switch (syncStatus) {
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        setLoading(true)
        break
      case codePush.SyncStatus.UNKNOWN_ERROR:
        setLoading(false)
        // Do we need alert dialog in this case ??
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

  return pug`
    if loading
      - const receivedBytes = get(progress, 'receivedBytes', 0)
      - const totalBytes = get(progress, 'totalBytes', 1)
      - const percent = (receivedBytes * 100 / totalBytes) ^ 0
      View.root
        Text.title
          | Installing update.
          = '\n'
          Text.wait Please wait
        View.progress
          Text.percent= percent + '%'
          View.bar
            View.filler(style={width: percent + '%'})
    else
      = Component
  `
})
