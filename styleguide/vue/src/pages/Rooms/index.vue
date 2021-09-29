<script>
  import model from '@startupjs/model'
  import { useQuery } from '../../helpers'
  import { Button } from '../../components'

  export default {
    name: 'page-rooms',
    components: { Button },
    setup () {
      return {
        rooms: useQuery('rooms', {})
      }
    }
  }
</script>

<template>
  <div :class="$style.roomsList">
    <div
      v-for="room, index in rooms"
      :class="$style.roomsItem"
    >
      <div :class="$style.roomsline">{{index + 1}}. {{room.name}}</div>
      <input
        :class="$style.roomsline"
        v-bind-racer="room.$.at('name')"
      />
      <div :class="$style.roomsline">Creator: </div>
      <Button :to="`/rooms/${room.id}`">Join</Button>
    </div>
  </div>
</template>

<style module>
  .roomslist {
    width: 100%;
  }
  .roomsline {
    margin-bottom: 8px;
  }
  .roomsItem {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 0 8px;
    border-bottom: 1px solid #eee;
    width: 100%;
  }
</style>
