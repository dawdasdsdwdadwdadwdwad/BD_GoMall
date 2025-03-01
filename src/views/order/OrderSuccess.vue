<template>
  <div class="order-success-container">
    <div class="success-card">
      <div class="success-icon">
        <i class="el-icon-success"></i>
      </div>
      <h1 class="success-title">订单提交成功</h1>
      <p class="order-number">订单号：{{ orderNumber }}</p>
      <p class="success-message">感谢您的购买，我们将尽快为您发货</p>

      <div class="order-info">
        <div class="info-item">
          <span class="label">支付方式：</span>
          <span class="value">{{ paymentMethodText }}</span>
        </div>
        <div class="info-item">
          <span class="label">订单金额：</span>
          <span class="value price">¥{{ orderAmount }}</span>
        </div>
      </div>

      <div class="action-buttons">
        <el-button type="primary" @click="viewOrderDetail"
          >查看订单详情</el-button
        >
        <el-button @click="continueShopping">继续购物</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderSuccess",
  data() {
    return {
      orderNumber: this.generateOrderNumber(),
      orderAmount: this.$route.query.amount || "0.00",
      paymentMethod: this.$route.query.payment || "alipay",
    };
  },
  computed: {
    paymentMethodText() {
      const methods = {
        alipay: "支付宝",
        wechat: "微信支付",
        card: "银行卡",
      };
      return methods[this.paymentMethod] || "在线支付";
    },
  },
  methods: {
    generateOrderNumber() {
      // 生成模拟订单号
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const random = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      return `${year}${month}${day}${random}`;
    },
    viewOrderDetail() {
      // 跳转到订单详情页
      this.$router.push(`/order/detail/${this.orderNumber}`);
    },
    continueShopping() {
      // 返回首页继续购物
      this.$router.push("/");
    },
  },
  created() {
    // 清空购物车中已选择的商品
    this.$store.dispatch("cartmodule/updateSelectedItems", []);
  },
};
</script>

<style scoped>
.order-success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.success-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  width: 100%;
  max-width: 600px;
}

.success-icon {
  font-size: 80px;
  color: #67c23a;
  margin-bottom: 20px;
}

.success-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 15px;
}

.order-number {
  font-size: 16px;
  color: #606266;
  margin-bottom: 10px;
}

.success-message {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
}

.order-info {
  background: #f5f7fa;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #606266;
}

.value {
  color: #303133;
  font-weight: bold;
}

.price {
  color: #f56c6c;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
