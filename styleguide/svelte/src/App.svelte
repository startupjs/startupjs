<script>
  import Component from './Component'
  import { storeQuery } from './storesApi.js';

  const temps = storeQuery('temp', {})
</script>

<div>
  {#each $temps as temp}
    <div>{temp.title}</div>
    <input bind:value={temp.title} />
  {/each}
</div>

<Component />
