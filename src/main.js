import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from "vue-apollo"


const httpLink = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/alifmufthi91/penerbitan-ijazah'
})
    
const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  connectToDevTools: true
})
    
Vue.use(VueApollo)
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)

window.Event =
new Vue({
  el: '#app',
  router,
  store,
  icons,
  apolloProvider,
  template: '<App/>',
  components: {
    App
  }
});
