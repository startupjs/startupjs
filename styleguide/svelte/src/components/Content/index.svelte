<script>
  import c from 'clsx'

</script>

<div class={c('content', $$props.class)}>
  <slot />
</div>

<style>
  .content {
    width: 1024px;
    margin: 0 auto;
  }
</style>
