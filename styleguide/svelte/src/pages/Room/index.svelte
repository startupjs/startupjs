<script>
  import { onDestroy, getContext } from 'svelte'
  import { racerQuery, racerDoc } from '../../helpers'

  export let roomId = ''

  const userId = getContext('user').id // storeSession
  const room$ = racerDoc('rooms', roomId)
  $: users$ = racerQuery('users', { _id: { $in: $room$?.userIds } })
  $: messages$ = racerQuery('messages', { roomId: $room$?.id })

  room$.onSubscribe = ()=> {
    if (!$room$.userIds) room$.set('userIds', [])
    room$.push('userIds', userId)
  }

  onDestroy(()=> onReset())

  function onReset () {
    const room = room$.get()
    const userIndex = room.userIds.findIndex(id => id === userId)
    if (userIndex === -1) return
    room$.remove('userIds', userIndex)
  }
</script>

<svelte:window on:beforeunload={onReset} />

<div class="root">
  Online {$users$?.length}: {$users$?.map(user=> user.login)}

  <div></div>

  <input />
</div>

<style>
  .root {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
  }
</style>
