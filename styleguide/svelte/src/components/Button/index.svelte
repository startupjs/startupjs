<script>
  import { createEventDispatcher } from 'svelte'
  import { Link } from 'svelte-routing'
  import c from 'clsx'

  export let to = ''
  export let variant = 'basic'

  const dispatch = createEventDispatcher()
  const classNames = c('button', `button-${variant}`, $$props.class)

  function getProps () {
    return { class: classNames }
  }
</script>

{#if to}
  <Link to={to} getProps={getProps}>
    <slot />
  </Link>
{/if}

{#if !to}
  <div
    class={classNames}
    on:click={()=> dispatch('click')}
  >
    <slot />
  </div>
{/if}

<style>
  :global(.button) {
    padding: 8px 16px;
    border-radius: 4px;
    transition: 0.3s all;
    text-decoration: none;
    cursor: pointer;
  }

  :global(.button-basic) {
    border: 1px solid transparent;
    background-color: #1f5aff;
    color: #fff;
  }
  :global(.button-basic:hover) {
    border-color: #1f5aff;
    background-color: transparent;
    color: #1f5aff;
  }

  :global(.button-second) {
    border: 1px solid transparent;
    background-color: #fff;
    color: #1f5aff;
  }
  :global(.button-second:hover) {
    border-color: #fff;
    background-color: transparent;
    color: #fff;
  }
</style>
