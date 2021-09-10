<script>
  import { storeQuery } from './storesApi.js';

  const temps = storeQuery('temp', {})
</script>

<div>length: {$temps.length}</div>
