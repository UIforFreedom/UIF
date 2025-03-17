import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

import uif from './uif/uif'
import {
  configObj as config
} from './uif/config'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,

    uif,
    config,
  },
  getters
})

export default store
