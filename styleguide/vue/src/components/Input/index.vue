<script>
  export default {
    props: {
      placeholder: String,
      value: String
    }
  }
</script>

<template>
  <input
    :value="value"
    :placeholder="placeholder"
    :class="$style.input"
    @input="$emit('input', $event.target.value)"
  />
</template>

<style module>
  .input {
    border: 1px solid #ddd;
    outline: none;
    padding: 8px 16px;
    font-size: 16px;
    border-radius: 4px;
  }
</style>
