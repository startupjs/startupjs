<script>
  export let placeholder = ''
  export let value
</script>

<input
  placeholder={placeholder}
  bind:value={value}
  class="input"
/>

<style>
  .input {
    border: 1px solid #ddd;
    outline: none;
    padding: 8px 16px;
    font-size: 16px;
    border-radius: 4px;
  }
</style>
