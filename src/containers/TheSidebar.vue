<template>
  <CSidebar
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <h4 color="bg-primary" class="c-sidebar-brand-full">IjazahClient</h4>
      <h4 color="bg-primary" class="c-sidebar-brand-minimized">IC</h4>
    </CSidebarBrand>
    <CRenderFunction flat :content-to-render.sync="sidebarMenu" >
      <template #named-slot>
      Element rendered by<CBadge class="ml-2" color="success">NAMED SLOT</CBadge>
    </template>
    </CRenderFunction>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import nav from "./_nav";
import AccountManager from "@/contracts/AccountManager";

export default {
  name: "TheSidebar",
  nav,
  data() {
    return {
      sidebarMenu: this.$options.nav["tes"],
    };
  },
  mounted() {
    let context = this
    console.log(nav)
    web3.eth.getAccounts().then((accounts) => {
      console.log("test:" + accounts[0]);
      AccountManager.methods
        .getRole(accounts[0])
        .call({ from: accounts[0] })
        .then(function (result) {
          console.log(web3.utils.hexToUtf8(result))
          switch(web3.utils.hexToUtf8(result)){
            case 'admin': context.sidebarMenu = nav["admin"];break;
            default : context.sidebarMenu = nav["def"];break;
          }
          context.$forceUpdate()
          console.log(context)
        });
    });
  },
  computed: {
    show() {
      return this.$store.state.sidebarShow;
    },
    minimize() {
      return this.$store.state.sidebarMinimize;
    },
  },
};
</script>
