import axios from "axios";

// 购物车相关API
export default {
  // 获取购物车
  getCart(userId) {
    return axios.get(`/api/cart/get?userId=${userId}`);
  },

  // 添加商品到购物车
  addToCart(userId, productId, quantity = 1) {
    return axios.post("/api/cart/add", {
      userId,
      productId,
      quantity,
    });
  },

  // 更新购物车商品数量
  updateCartItem(userId, productId, quantity) {
    return axios.put("/api/cart/update", {
      userId,
      productId,
      quantity,
    });
  },

  // 从购物车移除商品
  removeFromCart(userId, productId) {
    return axios.delete("/api/cart/remove", {
      data: {
        userId,
        productId,
      },
    });
  },

  // 清空购物车
  clearCart(userId) {
    return axios.delete(`/api/cart/clear?userId=${userId}`);
  },
};
