import ShoppingCartApi from "@/api/ShoppingCart";
import {
  SET_CART_ITEMS,
  SET_SELECTED_ITEMS,
  UPDATE_CART_ITEM_QUANTITY,
  REMOVE_CART_ITEM,
  CLEAR_CART,
  ADD_CART_ITEMS,
} from "@/utlis/MutationTypes";

export const cartmodule = {
  namespaced: true,
  state: {
    cartItems: [],
    selectedItems: [],
    testItems: [],
  },
  getters: {
    getCartItems: (state) => state.cartItems,
    getSelectedItems: (state) => state.selectedItems,
    getTotalPrice: (state) => {
      return state.selectedItems.reduce((total, item) => {
        return total + item.product.price * item.Quantity;
      }, 0);
    },
  },
  mutations: {
    [ADD_CART_ITEMS](state, item) {
      state.cartItems.push(item);
      state.testItems.push(item);
    },
    [SET_CART_ITEMS](state, items) {
      state.cartItems = items;
    },
    [SET_SELECTED_ITEMS](state, items) {
      state.selectedItems = items;
    },
    [UPDATE_CART_ITEM_QUANTITY](state, { productId, quantity }) {
      const item = state.cartItems.find((item) => item.ProductID === productId);
      if (item) {
        item.Quantity = quantity;
      }
    },
    [REMOVE_CART_ITEM](state, productId) {
      state.cartItems = state.cartItems.filter(
        (item) => item.ProductID !== productId
      );
      state.selectedItems = state.selectedItems.filter(
        (item) => item.ProductID !== productId
      );
    },
    [CLEAR_CART](state) {
      state.cartItems = [];
      state.selectedItems = [];
    },
  },
  actions: {
    async fetchCartItems({ commit }, userId) {
      try {
        const response = await ShoppingCartApi.getCart(userId);
        if (response.data.code === 200) {
          commit(SET_CART_ITEMS, response.data.data);
          return response.data.data;
        }
        return [];
      } catch (error) {
        console.error("获取购物车失败:", error);
        return [];
      }
    },
    async addToCart({ dispatch }, { userId, productId, quantity }) {
      try {
        const response = await ShoppingCartApi.addToCart(
          userId,
          productId,
          quantity
        );
        if (response.data.code === 200) {
          // 立即更新购物车数据，确保数据一致性
          await dispatch("fetchCartItems", userId);
          return true;
        }
        return false;
      } catch (error) {
        console.error("添加到购物车失败:", error);
        return false;
      }
    },
    async updateCartItem({ commit }, { userId, productId, quantity }) {
      try {
        const response = await ShoppingCartApi.updateCartItem(
          userId,
          productId,
          quantity
        );
        if (response.data.code === 200) {
          commit(UPDATE_CART_ITEM_QUANTITY, { productId, quantity });
          return true;
        }
        return false;
      } catch (error) {
        console.error("更新购物车失败:", error);
        return false;
      }
    },
    async removeFromCart({ commit }, { userId, productId }) {
      try {
        const response = await ShoppingCartApi.removeFromCart(
          userId,
          productId
        );
        if (response.data.code === 200) {
          commit(REMOVE_CART_ITEM, productId);
          return true;
        }
        return false;
      } catch (error) {
        console.error("从购物车移除失败:", error);
        return false;
      }
    },
    async clearCart({ commit }, userId) {
      try {
        const response = await ShoppingCartApi.clearCart(userId);
        if (response.data.code === 200) {
          commit(CLEAR_CART);
          return true;
        }
        return false;
      } catch (error) {
        console.error("清空购物车失败:", error);
        return false;
      }
    },
    updateSelectedItems({ commit }, items) {
      commit(SET_SELECTED_ITEMS, items);
    },
  },
};
