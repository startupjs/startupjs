import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react'
import { observer, useDoc, useLocal, useQuery, useValue } from '../../src'
import { alias } from '../util'
import _ from 'lodash'

const noObserver = fn => fn

const HooksComplex = () => {
  let renderCount = 0
  return observer(() => {
    useLayoutEffect(() => {
      renderCount = 0
    }, [])
    useLayoutEffect(() => {
      renderCount++
    })
    let loading = <Container {...{ renderCount }} />

    if (typeof DEBUG !== 'undefined') {
      console.log(`\nRENDER ${renderCount}:`)
    }
    let [user] = useDoc('users', alias(1))
    if (!user) return render()

    let [game1] = useDoc('games', alias(1))
    let [game2] = useDoc('games', alias(2))
    if (!(game1 && game2)) return render()

    let [players1] = useQuery('players', { _id: { $in: game1.playerIds } })
    let [players2] = useQuery('players', { _id: { $in: game2.playerIds } })
    if (!(players1 && players2)) return render()

    let [users1] = useQuery('users', {
      _id: { $in: players1.map(i => i.userId) }
    })
    let [users2] = useQuery('users', {
      _id: { $in: players2.map(i => i.userId) }
    })
    if (!(users1 && users2)) return render()

    function render () {
      return (
        <Container {...{ renderCount }}>
          <Items name='user' items={user} />
          <Items name='game1' items={game1} />
          <Items name='game2' items={game2} />
          <Items name='players1' items={players1} />
          <Items name='players2' items={players2} />
          <Items name='usersInGame1' items={users1} />
          <Items name='usersInGame2' items={users2} />
        </Container>
      )
    }

    return render()
  })
}

HooksComplex.displayName = 'HooksComplex'
export default HooksComplex

function useRenderCount () {
  let [renderCount, setRenderCount] = useState(0)
  useLayoutEffect(() => setRenderCount(renderCount + 1))
  return renderCount
}

function getItemsNames (items) {
  items = items || []
  if (!_.isArray(items)) items = [items]
  return items.map(i => i.name).join(',')
}

function Items ({ name, items }) {
  let names = useMemo(() => getItemsNames(items), [items])
  if (typeof DEBUG !== 'undefined') console.log(`  ${name}: ${names}`)
  return (
    <div className='items' title={name}>
      {names}
    </div>
  )
}

const Container = ({ renderCount, children }) => (
  <div className='root' title={'' + renderCount}>
    {children}
  </div>
)
