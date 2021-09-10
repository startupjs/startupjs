<script>
  import { storeQuery } from './storesApi';

  const storeTemp = storeQuery('temp', {})
</script>

<div class="root">length: {$storeTemp.length}</div>

<style>
  .root {
    margin-top: 16px;
  }
</style>
