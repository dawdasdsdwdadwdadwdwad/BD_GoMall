<template>
  <div class="product-detail-container">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else class="product-content">
      <div class="product-gallery">
        <img :src="product.image" class="product-image" alt="商品图片" />
      </div>
      <div class="product-info">
        <h1 class="product-title">{{ product.title }}</h1>
        <div class="product-price">
          <span class="price-label">价格：</span>
          <span class="price-value">¥{{ product.price }}</span>
        </div>
        <div class="product-description">
          <h3>商品描述</h3>
          <p>{{ product.description }}</p>
        </div>
        <div class="product-actions">
          <el-input-number
            v-model="quantity"
            :min="1"
            :max="99"
            size="small"
            class="quantity-input"
          ></el-input-number>
          <el-button
            type="primary"
            size="large"
            @click="addToCart"
            :loading="addingToCart"
          >
            加入购物车
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductApi from "@/api/ProductApi";
export default {
  name: "ProductDetail",
  data() {
    return {
      product: {
        id: null,
        title: "",
        price: 0,
        description: "",
        image: "",
      },
      quantity: 1,
      loading: true,
      addingToCart: false,
      userId: 1, // 模拟用户ID，实际应从用户状态获取
    };
  },
  created() {
    this.fetchProductDetails();
  },
  methods: {
    async fetchProductDetails() {
      const productId = this.$route.params.id;
      this.loading = true;
      try {
        // 调用API获取商品详情
        const response = await ProductApi.getProductDetail(productId);
        this.product = response.data.data;
      } catch (error) {
        console.error("获取商品详情失败:", error);
        this.$message.error("获取商品详情失败");
      } finally {
        this.loading = false;
      }
    },
    async addToCart() {
      if (this.addingToCart) return;

      this.addingToCart = true;
      try {
        const response = await this.$store.dispatch("cart/addToCart", {
          userId: this.userId,
          productId: this.product.id,
          quantity: this.quantity,
        });
        if (response) {
          this.$message.success("成功加入购物车");
        } else {
          this.$message.error(response.data.message || "加入购物车失败");
        }
      } catch (error) {
        console.error("加入购物车失败:", error);
        this.$message.error("加入购物车失败");
      } finally {
        this.addingToCart = false;
      }
    },
  },
};
</script>

<style scoped>
.product-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 80px;
}

.loading-container {
  padding: 40px 0;
}

.product-content {
  display: flex;
  gap: 40px;
}

.product-gallery {
  flex: 1;
  max-width: 500px;
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-info {
  flex: 1;
}

.product-title {
  font-size: 24px;
  color: #303133;
  margin: 0 0 20px;
}

.product-price {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.price-label {
  font-size: 16px;
  color: #606266;
}

.price-value {
  font-size: 28px;
  color: #f56c6c;
  font-weight: bold;
  margin-left: 10px;
}

.product-description {
  margin: 20px 0;
}

.product-description h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 10px;
}

.product-description p {
  color: #606266;
  line-height: 1.6;
}

.product-actions {
  margin-top: 30px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.quantity-input {
  width: 120px;
}
</style>
