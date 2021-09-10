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
  <div class="form">
    <input
      class="addInput"
      placeholder="New"
      bind:value={stateTemp.title}
    />
    <div class="add" on:click={add}>Add</div>
  </div>

  {#each $storeTemp as temp}
    <div class="case">
      <div>value: {temp.title}</div>
      <div class="item">
        <input bind:value={temp.title} />
        <div
          class="del"
          on:click={()=> temp.del()}
        >Del</div>
      </div>
    </div>
  {/each}
</div>

<Component />

<style>
  * {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  .form {
    display: flex;
  }
  .addInput {
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #9a52dc;
    outline: none;
  }
  .add {
    background-color: #9a52dc;
    color: #ffffff;
    margin-left: 8px;
    padding: 8px 24px;
    border-radius: 4px;
    cursor: pointer;
  }
  .del {
    background-color: red;
    padding: 8px 24px;
    margin-left: 8px;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
  }
  .case {
    margin-top: 16px;
  }
  .item {
    display: flex;
  }
</style>
