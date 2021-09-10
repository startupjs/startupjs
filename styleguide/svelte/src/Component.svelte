<script>
  import { storeQuery } from './storesApi';

  const storeTemp = storeQuery('temp', {})
</script>

<div>length: {$storeTemp.length}</div>
