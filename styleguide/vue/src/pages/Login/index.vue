<script>
  import model from '@startupjs/model'
  import { Input, Button } from '../../components'

  export default {
    components: { Input, Button },
    methods: {
      onSubmit() {
        if (!this.user.login) return

        this.user.id = model.id()
        localStorage.setItem('user', JSON.stringify(this.user))

        model.scope('users').add(this.user)
        window.location.pathname = '/'
      }
    },
    data: ()=> ({
      user: { id: '', login: '' }
    })
  }
</script>

<template>
  <div :class="$style.login">
    <Input
      placeholder="Write login"
      v-model="user.login"
    />
    <Button
      :class="$style.loginButton"
      @click="onSubmit"
    >Login</Button>
  </div>
</template>

<style module>
  .login {
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
  }
  .loginButton {
    margin-left: 8px;
  }
</style>
