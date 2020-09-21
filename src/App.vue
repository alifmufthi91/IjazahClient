<template>
  <router-view :key="componentKey"></router-view>
</template>

<script>
import web3 from './js/web3';
// import regeneratorRuntime from 'regenerator-runtime';

export default {
  name: 'App',
  data() {
    return {
      componentKey: 0,
    };
  },
  created() {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length < 1) return false;
      this.componentKey += 1;
      if(this.$router.currentRoute.path != "/dashboard") this.$router.push("/dashboard");
    })
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
