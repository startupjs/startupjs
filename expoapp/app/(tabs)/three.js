import { pug, styl, observer, useSub, $, axios } from 'startupjs'
import { Link, Button, Br, User, Card } from 'startupjs-ui'
import { Text, View } from '@/components/Themed'

export default observer(function TabThreeScreen () {
  const $user = useSub($.users[$.session.userId.get()])
  const address1 = { city: { street: { building: 42, isFlat: true } } }
  const address2 = {}

  const renderDummy = () => {
    return <Text>dummy jsx</Text>
  }

  async function handleTestWorkerJob () {
    const numbers = [1, 5, 3, 9, 2]
    const response = await axios.post('/api/worker/highestNumber', { numbers })
    console.log(response.data)
  }

  async function handleTestWorkerJobWithError () {
    const numbers = [1, '5', 3, 9, 2] // This will cause an error because '5' is a string
    try {
      const response = await axios.post('/api/worker/highestNumber', { numbers })
      console.log('Success:', response.data)
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message)
    }
  }

  return pug`
    View.container
      = renderDummy()
      Text.title Tab Three
      View
        Text= address2.something ?? 'nullish coalescing'
        Text= address1?.city?.street?.building
        if address1?.city?.street?.isFlat
          Text address 1 is flat
        else
          Text address 1 is NOT flat
        if address2?.city?.street?.isFlat
          Text address 2 is flat
        else
          Text address 2 is NOT flat
      View.box
      Br
      if $user.get()
        Card.card
          User(
            avatarUrl=$user.avatarUrl.get()
            name=$user.name.get()
          )
      Br
      Link(to='/auth/login')
        Button Login
      Br
      Button(onPress=handleTestWorkerJob) Run Worker Job (check console)
      Button(onPress=handleTestWorkerJobWithError) Run Worker Job with Error (check console)
  `
  styl`
    .card
      padding-top 1u
      padding-bottom 1u
  `
})

styl`
  .container
    flex 1
    align-items center
    justify-content center
  .title
    font-size 20px
    font-weight bold
  .separator
    margin 30px 0
    height 1px
    width 80%
  .box
    width 4u
    height @width
    background-color red
    +tablet()
      background-color green
`
