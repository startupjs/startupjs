<script>
  import { watch, onUnmounted, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useDoc, useQuery } from '../../helpers'

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  export default {
    name: 'page-room',
    setup (props, context) {
      const route = useRoute()
      const room = useDoc('rooms', route.params.roomId)
      const users = computed(()=> useQuery('users', {
        _id: { $in: room.value?.userIds }
      }))

      // remove userId, test case
      onMounted(()=> setTimeout(()=> onReset(), 5000))
      onUnmounted(()=> onReset())
      function onReset () {
        const userIndex = room.value.userIds.findIndex(id => id === user.id)
        if (userIndex === -1) return
        room.value.$.remove('userIds', userIndex)
      }

      // add userId, after init room
      watch(room, (room, prev) => {
        if (prev === null && room) {
          if (!room.userIds) room.$.set('userIds', [])
          const userIndex = room.userIds.findIndex(id => id === user.id)
          if (userIndex !== -1) return
          room.$.push('userIds', user.id)
        }
      })

      return { room, users }
    }
  }
</script>

<template>
  <div v-if="users.value" :class="$style.root">
    Online {{users.value.length}}: {{users.value.map(user=> user.login).join(', ')}}

    {{room}}
  </div>
</template>

<style module>
  .root {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
  }
</style>
