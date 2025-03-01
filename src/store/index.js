import Vue from "vue";
import Vuex from "vuex";
import { usermodule } from "./user/usermodule.js";
import { cartmodule } from "./cart/cartmodule.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user: usermodule,
    cart: cartmodule,
  },
});
