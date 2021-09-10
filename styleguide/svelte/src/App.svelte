<script>
  import { temps } from './stories.js';
</script>

<div>
  {#each $temps as temp}
    <div>{temp.title}</div>
    <input bind:value={temp.title} />
  {/each}
</div>
