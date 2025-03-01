import axios from "axios";

// 商品相关API
export default {
  // 获取热销商品列表
  getHotProducts(page = 1, pageSize = 10) {
    return axios.get(`/api/products?page=${page}&pageSize=${pageSize}`);
  },

  // 获取商品详情
  getProductDetail(productId) {
    return axios.get(`/api/products/${productId}`);
  },

  // 搜索商品
  searchProducts(keyword) {
    return axios.get(
      `/api/products/search?keyword=${encodeURIComponent(keyword)}`
    );
  },
};
