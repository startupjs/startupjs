import React, { useState, useMemo, useRef } from 'react'
// TODO: Test useDoc$ and useQuery$
import { ScrollView } from 'react-native'
import { pug, styl, observer, useComponentId, $, useDoc$, useQuery$, useValue$ } from 'startupjs'
import { Br, Div, Button, Link, Row, Span, Card, H5, Item, prompt } from '@startupjs/ui'

export default observer(function PPlayground () {
  return pug`
    ScrollView.page(wrap)
      Div.column(width='mobile')
        H5 Simple passing of $value
        Simple
      Div.column(width='mobile')
        H5 Test useQuery$
        Queries
  `
  /* eslint-disable-line */styl`
    .page
      height 100vh
      background-color #f2f2f2
      &:part(contentContainer)
        flex 1
        flex-direction row
    .column
      flex 1
      padding 2u
      max-width $UI.media.mobile
  `
})

const Simple = observer(() => {
  const [count, setCount] = useState(0)
  const [date] = useState(Date.now())

  const $magicCounter = useValue$({ value: 100 })
  const { $foo } = $.session

  const componentId = useComponentId()
  const magic = useMemo(() => Math.random(), [])

  function onPress () {
    setCount(count + 1)
    const { $value } = $magicCounter
    $value.set($value.get() + 1)
  }

  return pug`
    Br
    Button(onPress=onPress) Button 1 - #{count} - #{$magicCounter.value.get()}
    Br
    Span #{$foo.number.path()} value: #{$foo.number.get()}
    Br
    Sub($value=$magicCounter.value $foo=$foo style={ backgroundColor: 'cyan', height: 100 } title='Sub inline styles')
    Br
    Sub.sub($value=$magicCounter.value $foo=$foo title='Sub class styles')
    Br
    Link(to='/playground2') Go to Playground 2
    Span
      | Hello world here again here ping 28.
      | ID: #{componentId}
      | Magic: #{magic}
      | Date: #{date}
  `
  /* eslint-disable-line */styl`
    .sub
      backgroundColor lime
      height 100px
  `
})

const Sub = observer(({ $value, $foo, title }) => {
  const renderRef = useRef(0)
  const [, setForceRerender] = useState()
  const { $number } = $foo
  ++renderRef.current

  return pug`
    Card
      H5= title
      Button(onPress=() => $value.set($value.get() + 1)) Increase magicCounter.value from Sub
      Br
      Button(onPress=() => $number.set(~~$number.get() + 1)) Increment #{$number.path()} as Signal
      Br
      Sub2($value=$value)
      Row(
        part='root'
        align='center'
        vAlign='center'
        onPress=() => {
          setForceRerender(Math.random())
        }
      )
        Span Renders: #{renderRef.current}.
  `
  /* eslint-disable-line */styl``
})

const Sub2 = observer(({ $value }) => {
  return pug`
    Span Sub2 magicCounter.value: #{ $value.get() }
  `
  /* eslint-disable-line */styl``
})

const Queries = observer(() => {
  const $games = useQuery$('pgGames', { $limit: 10, $sort: { createdAt: -1 } })
  const $selectedGameId = useValue$()

  async function newGame () {
    const name = await prompt('Enter game name')
    if (!name) return
    $selectedGameId.set(await $games.addNew({ name }))
  }

  return pug`
    H5 Games list
    each $game in $games
      GameListItem(key=$game.id.get() $game=$game $selectedGameId=$selectedGameId)
    Button(onPress=newGame) + New game
    Br
    if $selectedGameId.get()
      Game(key=$selectedGameId.get() $gameId=$selectedGameId)
  `
  /* eslint-disable-line */styl``
})

const GameListItem = observer(({ $game, $selectedGameId }) => {
  return pug`
    Item(onPress=() => $selectedGameId.set($game.id.get()))= $game.name.get()
  `
  /* eslint-disable-line */styl``
})

const Game = observer(({ $gameId }) => {
  const { gameId, $game, $gameData, $players } = useSubscribe(() => {
    const gameId = $gameId.get()
    const $game = useDoc$('pgGames', gameId)
    const $gameData = useDoc$('pgGameDatas', gameId)
    if (!$gameData.get()) throw $gameData.addSelf(gameId)
    const $players = useQuery$('pgPlayers', { gameId })
    return { gameId, $game, $gameData, $players }
  })

  async function newPlayer () {
    const name = await prompt('Enter player name')
    if (!name) return
    await $players.add({ name, gameId })
    await $game.playersCount.increment()
  }

  return pug`
    H5 Game #{$game.name.get()}
    Span Round: #{$gameData.round.get()}
    Span Players:
    each $player, index in $players
      Player(key=$player.id.get() $player=$player index=index)
    Button(onPress=newPlayer) + New player
  `
  /* eslint-disable-line */styl``
})

const Player = observer(({ $player, index }) => {
  return pug`
    Item= '' + index + '. ' + $player.name.get()
  `
  /* eslint-disable-line */styl``
})

function useSubscribe (fn) {
  /* eslint-disable-next-line */
  const lastSyncedProps = useRef() // TODO: Have to trigger update for model-only hooks
  const subscriptionProps = fn()
  return subscriptionProps
}

/* eslint-disable-next-line */
function subscribe (SubscriptionComponent) {
  return function wrapIntoSubscription (Component) {
    const ObservableComponent = observer(Component)

    function FullSubscriptionComponent (componentProps) {
      const subscriptionProps = SubscriptionComponent(componentProps)
      // TODO: when the re-subscription waterfall starts, wait until it fully ends.
      //       In order to achieve this there should be a sync flag set inside observer()
      //       which shows whether any item has an active re-subscription.
      return <ObservableComponent {...componentProps} {...subscriptionProps} />
    }
    const ObservableFullSubscriptionComponent = observer(FullSubscriptionComponent)

    function WrappedComponent (componentProps) {
      return <ObservableFullSubscriptionComponent {...componentProps} />
    }
    return React.memo(WrappedComponent)
  }
}
