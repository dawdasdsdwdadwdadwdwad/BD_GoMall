<template>
  <div class="hot-sale-container">
    <h1 class="page-title">热销商品</h1>
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    <el-row v-else :gutter="20" class="HotSaleContainer">
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        v-for="product in products"
        :key="product.id"
      >
        <el-card
          :body-style="{ padding: '0px' }"
          class="product-card"
          @click.native="viewProductDetail(product.id)"
        >
          <img :src="product.image" class="product-image" alt="商品图片" />
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <div class="price-section">
              <span class="price">¥{{ product.price }}</span>
              <el-button
                type="primary"
                size="small"
                @click.stop="addToCart(product)"
                >加入购物车</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[12, 24, 36, 48]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import ProductApi from "@/api/ProductApi";
import ShoppingCartApi from "@/api/ShoppingCart";

export default {
  name: "HotSale",
  data() {
    return {
      products: [], // 热销商品列表
      loading: true, // 加载状态标识
      currentPage: 1, // 当前页码
      pageSize: 12, // 每页显示数量
      total: 0, // 商品总数
    };
  },
  created() {
    this.fetchHotProducts(); // 组件创建时获取热销商品数据
  },
  methods: {
    /**
     * 获取热销商品列表数据
     */
    async fetchHotProducts() {
      try {
        const response = await ProductApi.getHotProducts(
          this.currentPage,
          this.pageSize
        );
        if (response.data.code === 200) {
          this.products = response.data.data.items;
          this.total = response.data.data.total;
        } else {
          this.$message.error("获取商品列表失败");
        }
      } catch (error) {
        console.error("获取商品列表出错:", error);
        this.$message.error("获取商品列表出错");
      } finally {
        this.loading = false;
      }
    },
    /**
     * 处理每页显示数量变化
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1; // 重置到第一页
      this.fetchHotProducts();
    },
    /**
     * 处理页码变化
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchHotProducts();
    },
    /**
     * 将商品添加到购物车
     * @param {Object} product - 要添加到购物车的商品对象
     */
    async addToCart(product) {
      try {
        const userId = 1; // 模拟用户ID，实际应从用户状态获取
        const response = await ShoppingCartApi.addToCart(userId, product.id, 1);
        if (response.data.code === 200) {
          this.$message.success(`已将 ${product.title} 加入购物车`);
        } else {
          this.$message.error(response.data.message || "添加到购物车失败");
        }
      } catch (error) {
        console.error("添加到购物车出错:", error);
        this.$message.error("添加到购物车失败");
      }
    },
    /**
     * 查看商品详情
     * @param {number|string} productId - 商品ID
     */
    viewProductDetail(productId) {
      this.$router.push(`/product/${productId}`);
    },
  },
};
</script>

<style scoped>
/* 热销商品容器样式 */
.hot-sale-container {
  padding: 20px;
  padding-bottom: 80px; /* 为底部导航栏留出空间 */
  max-width: 1200px;
  margin: 0 auto;
}
.HotSaleContainer {
  margin-left: 30px;
  margin-right: 30px;
}
/* 加载状态容器样式 */
.loading-container {
  padding: 40px 0;
}

/* 页面标题样式 */
.page-title {
  margin-bottom: 30px;
  font-size: 28px;
  color: #303133;
}

/* 商品卡片样式 */
.product-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

/* 商品卡片悬停效果 */
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 商品图片样式 */
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

/* 商品信息容器样式 */
.product-info {
  padding: 14px;
}

/* 商品标题样式 */
.product-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 10px;
}

/* 价格区域样式 */
.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 价格标签样式 */
.price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

/* 分页容器样式 */
.pagination-container {
  margin-top: 30px;
  text-align: center;
}
</style>
