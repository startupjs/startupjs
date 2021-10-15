<script>
  import axios from 'axios'
  import { initSession } from 'helpers'

  export default {
    methods: {
      async onSubmit() {
        // validate errors
        if (!this.user.email) return
        if (!this.user.password) return

        await axios.post('/auth/local-login', this.user, { withCredentials: true })
        await initSession()

        this.$router.push({ name: 'games' })
      }
    },
    data: ()=> ({
      user: {
        email: '',
        password: ''
      }
    })
  }
</script>

<template>
  <div :class="$style.root">
    <n-h3>Sign In</n-h3>

    <div :class="$style.form">
      <n-input
        :class="$style.input"
        placeholder="Email"
        v-model:value="user.email"
      />

      <n-input
        :class="$style.input"
        placeholder="Password"
        v-model:value="user.password"
      />

      <n-button
        :class="$style.button"
        type="primary"
        @click="onSubmit"
      >Login</n-button>
    </div>
  </div>
</template>

<style module>
  .root {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
  }
  .input {
    width: 100%;
    margin-bottom: 8px;
  }
  .form {
    width: 320px;
  }
  .button {
    width: 100%;
  }
</style>
