<script>
  import model from '@startupjs/model'
  import { getContext } from 'svelte'
  import { navigate } from 'svelte-routing'
  import { Input, Button } from '../../components'

  let data = {
    userId: getContext('user').id
  }

  function onSubmit () {
    if (!data.name) return

    model.scope('rooms').add(data)
    navigate('/')
  }
</script>

<div class="root">
  <Input
    placeholder="Room name"
    bind:value={data.name}
  />
  <Button
    class="buttonCreate"
    on:click={onSubmit}
  >Create</Button>
</div>

<style>
  :global(.buttonCreate) {
    margin-top: 8px;
  }

  .root {
    margin-top: 16px;
  }
</style>
