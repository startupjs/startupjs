import { useState } from 'react'
import { StyleSheet, Image } from 'react-native'

import { axios, useValue$, observer, $ } from 'startupjs'
import { Br, Button, Div, Span, Link } from '@startupjs/ui'
import { BASE_URL } from '@env'
import { Text, View } from '@/components/Themed'

export default observer(function TabOneScreen () {
  const { $banner, $userId, $serverHello } = $.session
  const $count = useValue$(0)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  async function fetchSomething () {
    async function fetchText () {
      try {
        const response = await axios.get('/api/hello')
        setText(response.data)
      } catch (error) {
        setError(error.message)
        console.error('There has been a problem with your fetch operation:', error)
      }
    }

    await fetchText()
  }

  console.log(BASE_URL + '/assets1/avatar1.png')
  return (
    <View style={styles.container}>
      <Image source={{ uri: BASE_URL + '/assets/images/avatar1.png' }} style={{ width: 100, height: 100 }} />
      <Image source={{ uri: BASE_URL + '/assets1/images/avatar1.png' }} style={{ width: 100, height: 100 }} />
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
