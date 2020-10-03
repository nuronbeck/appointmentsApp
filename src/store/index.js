import Vue from 'vue'
import Vuex from 'vuex'
import application from './modules/application'
import appointment from './modules/appointment'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    application,
    appointment
  }
})
