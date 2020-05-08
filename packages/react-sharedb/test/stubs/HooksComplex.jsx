import React, { useLayoutEffect, useMemo } from 'react'
import { observer, useDoc, useQuery } from '../..'
import { alias } from '../util'
import isArray from 'lodash/isArray'

const HooksComplex = () => {
  let renderCount = 0
  return observer(() => {
    useLayoutEffect(() => {
      renderCount = 0
    }, [])
    useLayoutEffect(() => {
      renderCount++
    })

    if (typeof DEBUG !== 'undefined') {
      console.log(`\nRENDER ${renderCount}:`)
    }
    let [user] = useDoc('users', alias(1))

    // TODO: batch next 2 together
    let [game1] = useDoc('games', alias(1))
    let [game2] = useDoc('games', alias(2))

    // TODO: batch next 2 together
    let [players1] = useQuery('players', { _id: { $in: game1.playerIds } })
    let [players2] = useQuery('players', { _id: { $in: game2.playerIds } })

    // TODO: batch next 2 together
    let [users1] = useQuery('users', {
      _id: { $in: players1.map(i => i.userId) }
    })
    let [users2] = useQuery('users', {
      _id: { $in: players2.map(i => i.userId) }
    })

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
  }, {
    fallback: <Container renderCount={9999} />
  })
}

HooksComplex.displayName = 'HooksComplex'
export default HooksComplex

// function useRenderCount () {
//   let [renderCount, setRenderCount] = useState(0)
//   useLayoutEffect(() => setRenderCount(renderCount + 1))
//   return renderCount
// }

function getItemsNames (items) {
  items = items || []
  if (!isArray(items)) items = [items]
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
