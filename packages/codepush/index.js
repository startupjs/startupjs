import React, { useState, useEffect } from 'react'
import codePush from 'react-native-code-push'
import { AppState, View, Text } from 'react-native'
import './index.styl'

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL
}

const CodePushComponent = codePush(codePushOptions)(function CodePush ({
  children
}) {
  const [appStateStore, setAppStateStore] = useState('')
  const [progress, setProgress] = useState()

  useEffect(function () {
    checkForUpdate()

    function handleAppStateChange (nextAppState) {
      if (
        appStateStore.match(/inactive|background/) && nextAppState === 'active'
      ) {
        checkForUpdate()
      }
      setAppStateStore(nextAppState)
    }

    AppState.addEventListener('change', handleAppStateChange)

    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  function codePushStatusDidChange (syncStatus) {
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        break
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        break
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        break
      case codePush.SyncStatus.INSTALLING_UPDATE:
        break
      case codePush.SyncStatus.UP_TO_DATE:
        setProgress()
        break
      case codePush.SyncStatus.UPDATE_IGNORED:
        setProgress()
        break
      case codePush.SyncStatus.UPDATE_INSTALLED:
        setProgress()
        break
      case codePush.SyncStatus.UNKNOWN_ERROR:
        setProgress()
        break
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
    if progress
      - const percent = (progress.receivedBytes * 100 / progress.totalBytes) ^ 0
      View.root
        Text.title Installing update.
        Text.description Please wait
        View.progress
          Text.percent= percent + '%'
          View.bar
            View.filler(style={width: percent + '%'})
    else
      = children
  `
})

export default function CodePushApp (NativeApp) {
  return function CodePushAppComponent (props) {
    return (
      <CodePushComponent>
        <NativeApp {...props} />
      </CodePushComponent>
    )
  }
}
