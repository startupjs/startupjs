<script>
  import Component from './Component'
  import { storeQuery } from './storesApi';

  const storeTemp = storeQuery('temp', {})
  let stateTemp = {}

  function add () {
    storeTemp.add(stateTemp)
    stateTemp = {}
  }
</script>

<div>
  <div>
    <input bind:value={stateTemp.title} />
    <div on:click={add}>onAdd</div>
  </div>

  {#each $storeTemp as temp}
    <div>
      <div>value: {temp.title}</div>
      <input bind:value={temp.title} />
      <div on:click={()=> temp.del()}>onDel</div>
      <div>-------</div>
    </div>
  {/each}
</div>

<Component />
