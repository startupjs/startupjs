import { useState } from 'react'
import { StyleSheet } from 'react-native'

import { axios } from 'startupjs'
import { Br, Button } from '@startupjs/ui'
import EditScreenInfo from '@/components/EditScreenInfo'
import { Text, View } from '@/components/Themed'

export default function TabOneScreen () {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  async function fetchSomething (): Promise<void> {
    async function fetchText () {
      try {
        const response = await axios.get('/hello')
        setText(response.data)
      } catch (error: any) {
        setError(error.message)
        console.error('There has been a problem with your fetch operation:', error)
      }
    }

    await fetchText()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Br />
      <Text>URL: {JSON.stringify(window?.location?.origin)}</Text>
      <Br />
      <Button onPress={fetchSomething}>Fetch stuff</Button>
      <Br />
      {text ? <Text>Text: {text}</Text> : undefined}
      {error ? <Text>Error: {error}</Text> : undefined}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
})
