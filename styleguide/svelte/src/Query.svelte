<script>
  import { storeQuery } from './storesApi'

  const query$ = storeQuery('temp', {})
  let doc = {}

  function add () {
    query$.add(doc)
    doc = {}
  }
</script>

<div>
  <div class="form">
    <input bind:value={doc.title} />
    <div class="button" on:click={add}>Add</div>
  </div>

  <div class="list">
    {#each $query$ || [] as doc}
      <div class="item">
        <div>
          <div class="itemTitle">Current title: {doc.title}</div>
          <input
            value={doc.title}
            on:input={e=> query$.at(doc.id).set('title', e.target.value)}
          />
        </div>
        <div on:click={()=> query$.at(doc.id).del()}>Del</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .form {
    margin-top: 8px;
    display: flex;
  }
  .button {
    padding: 8px 16px;
    background-color: gray;
  }
  .list {
    margin-top: 8px;
  }
  .item {
    display: flex;
  }
  .itemTitle {
    width: 200px;
  }
</style>
