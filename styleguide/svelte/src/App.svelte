<script>
  import Query from './Query'
  import Doc from './Doc'

  const pathname = window.location.pathname;

  const components = {
    '/': Query,
    '/doc': Doc
  }
</script>

<div>
  <div class="menu">
    <div
      class="menuItem"
      class:menuItemActive={pathname === '/'}
      on:click={()=> window.location.pathname = '/'}
    >Query</div>
    <div
      class="menuItem"
      class:menuItemActive={pathname === '/doc'}
      on:click={()=> window.location.pathname = '/doc'}
    >Doc</div>
  </div>

  <svelte:component this={components[pathname]} />
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  .menu {
    display: flex;
  }
  .menuItem {
    padding: 8px;
    cursor: pointer;
  }
  .menuItemActive {
    background-color: red;
    color: #fff;
  }
</style>
