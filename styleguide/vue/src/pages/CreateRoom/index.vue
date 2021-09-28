<script>
  import model from '@startupjs/model'
  import { Input, Button } from '../../components'

  const user = JSON.parse(localStorage.getItem('user'))

  export default {
    name: 'page-create-room',
    components: { Button, Input },
    methods: {
      onSubmit() {
        if (!this.name) return
        model.scope('rooms').add({
          userId: this.userId,
          name: this.name
        })
        this.$router.push({ name: 'home' })
      }
    },
    data: ()=> ({
      userId: user.id,
      name: ''
    })
  }
</script>

<template>
  <div :class="$style.createRoom">
    <Input
      placeholder="Room name"
      v-model="name"
    />

    <Button
      :class="$style.buttonCreate"
      @click="onSubmit"
    >Create</Button>
  </div>
</template>

<style module>
  .buttonCreate {
    margin-top: 8px;
  }
  .createRoom {
    margin-top: 16px;
  }
</style>
