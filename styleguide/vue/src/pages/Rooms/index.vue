<script>
  import { Button } from '../../components'

  export default {
    name: 'page-rooms',
    components: { Button }
  }
</script>

<template>
  <div :class="$style.roomsList">
    <div :class="$style.roomsItem">
      <div :class="$style.roomsline">index + 1. room.name</div>
      <input :class="$style.roomsline" />
      <div :class="$style.roomsline">Creator: </div>
      <Button to="/rooms/123">Join</Button>
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
