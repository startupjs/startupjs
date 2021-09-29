<script>
  export default {
    props: {
      placeholder: String,
      modelValue: String
    },
    emits: ['update:modelValue']
  }
</script>

<template>
  <input
    :value="modelValue"
    :placeholder="placeholder"
    :class="$style.input"
    @input="$emit('update:modelValue', $event.target.value)"
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
