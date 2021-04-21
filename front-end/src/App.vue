<template>
  <div id="app">
    <div v-if="showMenu" id="nav">
      <router-link to="/Global">Discover</router-link> |
      <router-link to="/">Profile</router-link> |
      <router-link to="/Profile">Feed</router-link>
    </div>
    <router-view />
    <div class='footer'><a href="https://github.com/skaduse/Final-Project">Github</a></div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  height: 50px;
  padding-top: 30px;
  background-color: #0078e7;
  color: white;
  font-size: 20px;
}

#nav a {
  font-weight: bold;
  color: white;
  text-decoration: none;
  font-size: 20px;
}

#nav a.router-link-exact-active {
  color: #bfbfbf
}

.footer {
  margin-top: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
  background-color: grey;
  height: 30px;
}
.footer a {
  color: white;
  text-decoration: none;
  font-size: 30px;
}
</style>

<script>

export default {
  name: 'App',
  computed: {
    showMenu: function () {
      if (this.$route.path == "/" && !this.$root.$data.user) {
        return false;
      }
      else if (this.$route.path.substr(1,5) == "photo") {
        return false;
      }
      else {
        return true;
      }
    }
  }
}

</script>
