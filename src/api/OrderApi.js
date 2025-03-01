import axios from "@/api/config";

const OrderApi = {
  /**
   * 创建订单
   * @param {Object} orderData - 订单数据
   * @param {Number} orderData.userId - 用户ID
   * @param {Array} orderData.products - 商品列表
   * @param {Object} orderData.address - 收货地址
   * @param {String} orderData.paymentMethod - 支付方式
   * @returns {Promise}
   */
  createOrder(orderData) {
    return axios.post("/api/orders", orderData);
  },

  /**
   * 获取订单列表
   * @param {Number} userId - 用户ID
   * @param {Number} page - 页码
   * @param {Number} pageSize - 每页数量
   * @returns {Promise}
   */
  getOrders(userId, page = 1, pageSize = 10) {
    return axios.get("/api/orders", {
      params: { userId, page, pageSize },
    });
  },

  /**
   * 获取订单详情
   * @param {String} orderId - 订单ID
   * @returns {Promise}
   */
  getOrderDetail(orderId) {
    return axios.get(`/api/orders/${orderId}`);
  },

  /**
   * 取消订单
   * @param {String} orderId - 订单ID
   * @returns {Promise}
   */
  cancelOrder(orderId) {
    return axios.put(`/api/orders/${orderId}/cancel`);
  },

  /**
   * 支付订单
   * @param {String} orderId - 订单ID
   * @param {String} paymentMethod - 支付方式
   * @returns {Promise}
   */
  payOrder(orderId, paymentMethod) {
    return axios.put(`/api/orders/${orderId}/pay`, { paymentMethod });
  },
};

export default OrderApi;
