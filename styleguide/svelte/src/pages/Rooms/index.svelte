<script>
  import { getContext } from 'svelte'
  import { Button } from '../../components'
  import { racerDoc, racerQuery } from '../../helpers'

  const user$ = racerDoc('users', getContext('user').id)
  const rooms$ = racerQuery('rooms', {})
  $: myRooms$ = racerQuery('rooms', { userId: $user$?.id })
</script>

<div class="list">
  {#if $rooms$}
    {#each $rooms$ as room, index}
      <div class="item">
        <div class="line">{index + 1}. {room.name}</div>
        <input
          class="line"
          value={room.name}
          on:input={e=> rooms$.at(room.id).set('name', e.target.value)}
        />
        <div class="line">Creator: </div>
        <Button to={`/rooms/${room.id}`}>Join</Button>
      </div>
    {/each}
  {:else}
    <div>loading...</div>
  {/if}
</div>

<style>
  .list {
    width: 100%;
  }
  .line {
    margin-bottom: 8px;
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 0 8px;
    border-bottom: 1px solid #eee;
    width: 100%;
  }
</style>
