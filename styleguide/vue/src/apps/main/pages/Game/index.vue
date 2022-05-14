<script>
  import { watch, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSession, useDoc, useQuery } from 'helpers'

  export default {
    name: 'games',
    setup() {
      const route = useRoute()
      const session = useSession()
      const game = computed(()=> useDoc('games', route.params.id))
      const users = computed(()=> useQuery('users', {
        _id: { $in: game.value?.value?.userIds || [] }
      }))

      watch(game.value, (cur, prev)=> {
        // add userId, after get game
        if (prev === null && cur) {

          console.log(users.value)
          console.log(cur.userIds)

          const { user } = session.value
          if (user.type === 'professor') return
          if (cur.userIds.includes(user.id)) return
          cur.$.push('userIds', user.id)
        }

        // waith 2 users for start game
        if (prev === null && cur.userIds.length === 2 && !cur.rounds.length) {
          cur.$.set('status', 'run')
          cur.$.set('balls', { [cur.userIds[0]]: 0, [cur.userIds[1]]: 0 })
          cur.$.increment('round')

          // round create
          cur.$.push('rounds', {
            users: {
              [cur.userIds[0]]: { select: '', balls: 0 },
              [cur.userIds[1]]: { select: '', balls: 0 }
            },
            winner: ''
          })
        }

        // game play
        const selectFirstUser = cur.rounds[cur.round].users[cur.userIds[0]].select
        const selectTwoUser = cur.rounds[cur.round].users[cur.userIds[1]].select
        if (selectFirstUser && selectTwoUser) {
          let winner;

          if (selectFirstUser === 'paper' && selectTwoUser === 'stone') {
            winner = cur.userIds[0]
          }
          if (selectFirstUser === 'stone' && selectTwoUser === 'paper') {
            winner = cur.userIds[1]
          }
          if (selectFirstUser === 'scissors' && selectTwoUser === 'paper') {
            winner = cur.userIds[0]
          }
          if (selectFirstUser === 'paper' && selectTwoUser === 'scissors') {
            winner = cur.userIds[1]
          }
          if (selectFirstUser === 'stone' && selectTwoUser === 'scissors') {
            winner = cur.userIds[0]
          }
          if (selectFirstUser === 'scissors' && selectTwoUser === 'stone') {
            winner = cur.userIds[1]
          }

          cur.$.set(`rounds.${cur.round}.winner`, winner)
          cur.$.increment('round')
          cur.$.push('rounds', {
            users: {
              [cur.userIds[0]]: { select: '', balls: 0 },
              [cur.userIds[1]]: { select: '', balls: 0 }
            },
            winner: ''
          })
          cur.$.increment(`rounds.${cur.round}.users.${winner}.balls`)
          cur.$.increment(`balls.${winner}`)
        }
      })

      function onFinishGame () {
        game.value.value.$.set('status', 'closed')
        game.value.value.$.set('closedAt', +new Date())
      }

      function getSelectValue (userId, roundIndex) {
        const gameValue = game.value.value
        return gameValue?.rounds[roundIndex]?.users[userId]?.select
      }

      function getWinner (roundIndex) {
        const gameValue = game.value.value
        const winnerId = gameValue?.rounds[roundIndex].winner
        const userIndex = gameValue.userIds.findIndex(userId=> userId === winnerId)
        return users.value.value[userIndex]?.email
      }

      function setSelectValue (value) {
        const gameValue = game.value.value
        const userId = session.value.user.id
        gameValue.$.set(`rounds.${gameValue.round}.users.${userId}.select`, value)
      }

      const options = [
        { label: 'Stone', value: 'stone' },
        { label: 'Scissors', value: 'scissors' },
        { label: 'Paper', value: 'paper' }
      ]

      return {
        game,
        users,
        session,
        options,
        getSelectValue,
        getWinner,
        setSelectValue,
        onFinishGame
      }
    }
  }
</script>

<template>
  <div v-if="game.value" :class="$style.rootGame">
    <div :class="$style.header">
      <div>
        <div>Status: {{game.value.status}}</div>
        <div>Number of players: {{game.value.userIds.length}}</div>
      </div>

      <div>
        <n-button
          type="success"
          v-if="session.user.type === 'professor'"
          :class="$style.gameSuccess"
        >Success</n-button>
        <n-button
          type="error"
          v-if="session.user.type === 'professor'"
          @click="onFinishGame"
        >Finish game</n-button>
      </div>
    </div>

    <div :class="$style.gamePlayers">
      <div v-if="users.value && users.value[0]">
        <div>Player 1</div>
        <div>{{users.value[0].email}}</div>
        <div>Points: {{game.value.balls[users.value[0].id]}}</div>
      </div>
      <div v-if="users.value && users.value[1]">
        <div>Player 2</div>
        <div>{{users.value[1].email}}</div>
        <div>Points: {{game.value.balls[users.value[1].id]}}</div>
      </div>
    </div>

    <div :class="$style.history">
      <div
        v-for="round, index in game.value.rounds"
        :class="$style.gameRound"
      >
        <div>Round: {{index + 1}}</div>

        <div :class="gameSelect">
          <n-select
            v-if="!round.users[session.user.id].select"
            :value="round.users[session.user.id].select"
            :options="options"
            @change="setSelectValue"
          />
        </div>

        <div v-if="!round.winner">Wait for users step</div>

        <div
          v-if="getSelectValue(game.value.userIds[0], index) && round.winner"
        >Player 1 selected - "{{getSelectValue(game.value.userIds[0], index)}}"</div>
        <div v-if="round.winner && users.value">
          Winner: {{getWinner(index)}}, get {{round.users[round.winner].balls}} balls
        </div>
        <div
          v-if="getSelectValue(game.value.userIds[1], index) && round.winner"
        >Player 2 selected - "{{getSelectValue(game.value.userIds[1], index)}}"</div>
      </div>
    </div>
  </div>
</template>

<style module>
  .gameRound {
    margin-top: 16px;
  }
  .gameSuccess {
    margin-right: 8px;
  }
  .gamePlayers {
    display: flex;
    width: calc(100vw - 240px);
    justify-content: space-between;
    margin-top: 36px;
  }
  .rootGame {
    width: calc(100vw - 240px);
  }
  .header {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .history {
    margin-top: 36px;
  }
</style>
