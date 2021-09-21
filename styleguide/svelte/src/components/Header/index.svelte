<script>
  import { Link } from 'svelte-routing'
  import Content from '../Content'
  import Button from '../Button'
</script>

<header>
  <Content class="content">
    <Link to="/">
      <div class="home" />
    </Link>
    <Button
      variant="second"
      to="/rooms/create"
    >Create room</Button>
  </Content>
</header>

<style>
  header {
    background-color: #1f5aff;
    padding: 8px 16px;
    box-sizing: border-box;
  }
  :global(.content) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .home {
    height: 46px;
    width: 46px;
    background-image: url('https://www.svgrepo.com/show/22031/home-icon-silhouette.svg');
    background-size: cover;
  }
</style>
