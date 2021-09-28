<script>
  export default {
    name: 'button',
    props: {
      to: String,
      variant: { type: String, default: 'basic' }
    }
  }
</script>

<template>
  <router-link
    v-if="to"
    :class="[$style.button, $style[variant]]"
    :to="to"
  >
    <slot />
  </router-link>

  <div
    v-else
    :class="[$style.button, $style[variant]]"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>

<style module>
  .button {
    padding: 8px 16px;
    border-radius: 4px;
    transition: 0.3s all;
    text-decoration: none;
    cursor: pointer;
  }

  .basic {
    border: 1px solid transparent;
    background-color: #1f5aff;
    color: #fff;
  }
  .basic:hover {
    border-color: #1f5aff;
    background-color: transparent;
    color: #1f5aff;
  }

  .second {
    border: 1px solid transparent;
    background-color: #fff;
    color: #1f5aff;
  }
  .second:hover {
    border-color: #fff;
    background-color: transparent;
    color: #fff;
  }
</style>
