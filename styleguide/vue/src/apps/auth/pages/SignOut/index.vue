<script>
  import axios from 'axios'
  import { initSession } from 'helpers'

  export default {
    methods: {
      async onSubmit() {
        // validate errors
        if (!this.user.email) return
        if (!this.user.password) return
        if (!this.user.type) return

        await axios.post('/auth/local-register', this.user)
        await axios.post('/auth/local-login', this.user, { withCredentials: true })
        await initSession()

        this.$router.push({ name: 'games' })
      }
    },
    data: ()=> ({
      user: {
        email: '',
        password: '',
        confirm: '',
        type: ''
      }
    })
  }
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.form">
      <n-input
        :class="$style.line"
        placeholder="Email"
        v-model:value="user.email"
      />

      <n-input
        :class="$style.line"
        placeholder="Password"
        v-model:value="user.password"
      />

      <n-input
        :class="$style.line"
        placeholder="Confirm"
        v-model:value="user.confirm"
      />

      <select
        :class="$style.line"
        @change="e=> user.type = e.target.value"
      >
        <option value="professor">Professor</option>
        <option value="gamer">Gamer</option>
      </select>

      <n-button @click="onSubmit">Sign Out</n-button>
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
  .line {
    width: 100%;
    margin-bottom: 8px;
  }
  .form {
    width: 320px;
  }
</style>
