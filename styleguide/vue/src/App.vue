<script>
  import { Header, Content } from './components'

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  export default {
    name: 'app',
    components: { Header, Content },
    data: ()=> ({ user })
  }
</script>

<template>
  <div>
    <Header v-if="user.id" />
    <Content>
      <router-view />
    </Content>
  </div>
</template>

<style>
  * {
    margin: 0;
    padding: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
</style>
