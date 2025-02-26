import Vue from "vue";
import Vuex from "vuex";
import { usermodule } from "./user/usermodule.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user: usermodule,
  },
});
