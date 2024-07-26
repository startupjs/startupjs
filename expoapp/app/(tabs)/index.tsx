import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { axios, observer, $ } from 'startupjs'
import { Br, Button, Div, Span, Link } from '@startupjs/ui'
import { Text, View } from '@/components/Themed'

export default observer(function TabOneScreen () {
  const { $banner, $userId, $serverHello } = $.session
  const $count = $(0)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  async function fetchSomething (): Promise<void> {
    async function fetchText () {
      try {
        const response = await axios.get('/api/hello')
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
      <Div row>
        <Button onPress={fetchSomething}>Fetch stuff</Button>
        <Button pushed onPress={() => $count.increment(1)}>Count {$count.get()}</Button>
        <Button pushed tooltip='Click me' onPress={() => $banner.visible.set(!$banner.visible.get())}>
          {$banner.visible.get() ? 'Hide' : 'Show'} Banner
        </Button>
      </Div>
      <Br />
      <Link to='/admin'>Admin Panel</Link>
      <Br />
      <Span>userId: {$userId.get()}</Span>
      <Span>{$serverHello.get()}</Span>
      <Br />
      {text ? <Text>Text: {text}</Text> : undefined}
      {error ? <Text>Error: {error}</Text> : undefined}
    </View>
  )
})

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
