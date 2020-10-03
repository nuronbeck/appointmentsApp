import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// UI plugins
import vuetify from './plugins/vuetify';
import './plugins/toastification'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
