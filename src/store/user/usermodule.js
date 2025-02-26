import { SET_TOKEN } from "@/utlis/MutationTypes";

export const usermodule = {
  namespaced: true,
  state: {
    token: "",
  },
  getters: {
    getToken: (state) => state.token,
  },
  mutations: {
    [SET_TOKEN](state, token) {
      state.token = token;
    },
  },
  actions: {
    setToken({ commit }, token) {
      commit(SET_TOKEN, token);
    },
  },
};
