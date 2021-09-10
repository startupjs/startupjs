<script>
  import { queryStore } from './storesApi.js';

  const temps = queryStore('temp', {})
</script>

<div>length: {$temps.length}</div>
