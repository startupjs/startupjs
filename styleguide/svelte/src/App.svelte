<script>
  import { setContext } from 'svelte'
  import { Router, Route, navigate } from 'svelte-routing'
  import { Rooms, CreateRoom, Room, Login } from './pages'
  import { Header, Content } from './components'

  export let url = ''

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.id) navigate('/login')

  setContext('user', user)
</script>

<Router url={url}>
  {#if user.id}
    <Header />
    <main>
      <Content>
        <Route path="/" component={Rooms} />
        <Route path="/rooms/:roomId" component={Room} />
        <Route path="/rooms/create" component={CreateRoom} />
      </Content>
    </main>
  {:else}
    <Route path="/login" component={Login} />
  {/if}
</Router>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
</style>
