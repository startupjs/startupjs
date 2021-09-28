<script>
  import Content from '../Content'
  import Button from '../Button'

  export default {
    name: 'header',
    components: { Content, Button }
  }
</script>

<template>
  <header>
    <Content :class="$style.content">
      <router-link to="/">
        <div :class="$style.home" />
      </router-link>
      <Button
        variant="second"
        to="/rooms/create"
      >Create room</Button>
    </Content>
  </header>
</template>

<style module>
  header {
    background-color: #1f5aff;
    padding: 8px 16px;
    box-sizing: border-box;
  }
  .home {
    height: 46px;
    width: 46px;
    background-image: url('https://www.svgrepo.com/show/22031/home-icon-silhouette.svg');
    background-size: cover;
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
