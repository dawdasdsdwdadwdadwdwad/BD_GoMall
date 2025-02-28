<template>
  <div id="app">
    <Header v-if="$route.meta.showHeader" />
    <Footer v-if="$route.meta.showFooter"></Footer>
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/HeaderShow.vue";
import Footer from "@/components/FooterShow.vue";
export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
