<script>
  export default {
    name: 'content'
  }
</script>

<template>
  <div :class="$style.content">
    <slot />
  </div>
</template>

<style module>
  .content {
    width: 1024px;
    margin: 0 auto;
  }
</style>
