<template>
  <div class="hot-sale-container">
    <h1 class="page-title">Hot sale</h1>
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        v-for="product in products"
        :key="product.id"
      >
        <el-card :body-style="{ padding: '0px' }" class="product-card">
          <img :src="product.image" class="product-image" />
          <div class="product-info">
            <h3 class="product-title">{{ product.name }}</h3>
            <div class="price-section">
              <span class="price">${{ product.price }}</span>
              <el-button type="primary" size="small" @click="addToCart(product)"
                >加入购物车</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "HotSale",
  data() {
    return {
      products: [
        {
          id: 1,
          name: "T-Shirt",
          price: 6.6,
          image: require("@/assets/logo.png"),
        },
        // 更多商品数据
      ],
    };
  },
  methods: {
    addToCart(product) {
      // TODO: 实现添加到购物车的逻辑
      this.$message.success(`已将 ${product.name} 加入购物车`);
    },
  },
};
</script>

<style scoped>
.hot-sale-container {
  padding: 20px;
}

.page-title {
  margin-bottom: 30px;
  font-size: 28px;
  color: #303133;
}

.product-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.product-info {
  padding: 14px;
}

.product-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 10px;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}
</style>
