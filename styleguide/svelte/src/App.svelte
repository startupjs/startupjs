<script>
  import Component from './Component'
  import { queryStore } from './storesApi.js';

  const temps = queryStore('temp', {})
</script>

<div>
  {#each $temps as temp}
    <div>{temp.title}</div>
    <input bind:value={temp.title} />
  {/each}
</div>

<Component />
