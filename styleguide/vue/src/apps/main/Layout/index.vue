<template>
  <div :class="$style.content">
    <nav :class="$style.nav">
      <router-link
        to="/"
        :class="$style.navItem"
      >Games</router-link>
    </nav>

    <main :class="$style.main">
      <router-view />
    </main>
  </div>
</template>

<style module>
  .main {
    padding: 16px;
    box-sizing: border-box;
  }
  .nav {
    display: flex;
    flex-direction: column;
    background-color: #06f;
    box-sizing: border-box;
    width: 200px;
    min-height: 100vh;
  }
  .navItem {
    text-decoration: none;
    padding: 16px;
    color: #fff;
  }
  .navItem:hover {
    background-color: rgba(0,0,0,0.1);
  }
  .content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }
</style>
