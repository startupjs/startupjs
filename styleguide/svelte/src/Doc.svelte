<script>
  import { storeDoc, storeQuery } from './storesApi'

  const query$ = storeQuery('temp', {})
  let doc$

  $: {
    if ($query$ && $query$[0]) {
      doc$ = storeDoc('temp', $query$[0].id)
    }
  }
</script>

<div>
  {#if $query$ && $doc$}
    <div>Current title: {$doc$.title}</div>
    <input
      placeholder="Change title"
      bind:value={$doc$.title}
    />
  {/if}
</div>
