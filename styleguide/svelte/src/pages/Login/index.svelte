<script>
  import model from '@startupjs/model'
  import { Input, Button } from '../../components'

  const user = { id: '', login: '' }

  function onSubmit () {
    if (!user.login) return

    user.id = model.id()
    localStorage.setItem('user', JSON.stringify(user))

    model.scope('users').add(user)
    window.location.pathname = '/'
  }
</script>

<div class="root">
  <Input
    placeholder="Write login"
    bind:value={user.login}
  />
  <Button
    class="loginButton"
    on:click={onSubmit}
  >Login</Button>
</div>

<style>
  :global(.loginButton) {
    margin-left: 8px;
  }
  .root {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
</style>
