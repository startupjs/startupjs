<script>
  import model from '@startupjs/model'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSession } from 'helpers'

  export default {
    name: 'games-create',
    setup() {
      const router = useRouter()
      const session = useSession()
      const game = ref({ name: '', status: 'pending' })

      async function onCreate () {
        await model.scope('games').add({
          ...game.value,
          auhtorId: session.value.user.id,
          createdAt: +new Date(),
          userIds: [],
          rounds: [],
          round: -1
        })
        router.push({ name: 'games' })
      }

      return { game, onCreate }
    }
  }
</script>

<template>
  <n-input
    :class="$style.gcInput"
    placeholder="Name"
    v-model:value="game.name"
  />

  <div :class="$style.gcActions">
    <n-button
      :class="$style.gcButton"
      @click="$router.go(-1)"
    >Cancel</n-button>
    <n-button
      type="primary"
      @click="onCreate"
    >Create</n-button>
  </div>
</template>

<style module>
  .gcInput {
    margin-bottom: 8px;
  }
  .gcButton {
    margin-right: 8px;
  }
</style>
