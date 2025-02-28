<template>
  <div class="shopping-cart-container">
    <h1 class="page-title">我的购物车</h1>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="cartItems.length === 0" class="empty-cart">
      <i class="el-icon-shopping-cart-2 empty-icon"></i>
      <p>购物车是空的</p>
      <el-button type="primary" @click="$router.push('/')">去购物</el-button>
    </div>

    <template v-else>
      <el-table
        ref="cartTable"
        :data="cartItems"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="商品" width="400">
          <template slot-scope="scope">
            <div class="product-info">
              <img :src="scope.row.product.image" class="product-image" />
              <div class="product-details">
                <h3>{{ scope.row.product.title }}</h3>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="单价" width="120">
          <template slot-scope="scope">
            <span class="price">¥{{ scope.row.product.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="数量" width="200">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.Quantity"
              :min="1"
              :max="99"
              size="small"
              @change="(value) => updateQuantity(scope.row, value)"
            ></el-input-number>
          </template>
        </el-table-column>

        <el-table-column label="小计" width="120">
          <template slot-scope="scope">
            <span class="subtotal"
              >¥{{
                (scope.row.product.price * scope.row.Quantity).toFixed(2)
              }}</span
            >
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="removeItem(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="cart-footer">
        <div class="cart-actions">
          <el-button @click="selectAll">全选</el-button>
          <el-button @click="clearSelected" type="danger">删除选中</el-button>
          <el-button @click="clearCart" type="danger">清空购物车</el-button>
        </div>

        <div class="cart-total">
          <div class="total-info">
            <span>已选择 {{ selectedItems.length }} 件商品</span>
            <span class="total-price"
              >总计: <strong>¥{{ totalPrice.toFixed(2) }}</strong></span
            >
          </div>
          <el-button
            type="primary"
            size="large"
            @click="checkout"
            :disabled="selectedItems.length === 0"
          >
            结算 ({{ selectedItems.length }})
          </el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ShoppingCartApi from "@/api/ShoppingCart";

export default {
  name: "ShoppingCar",
  data() {
    return {
      cartItems: [],
      selectedItems: [],
      loading: true,
      userId: 1, // 模拟用户ID，实际应从用户状态获取
    };
  },
  computed: {
    totalPrice() {
      return this.selectedItems.reduce((total, item) => {
        return total + item.product.price * item.Quantity;
      }, 0);
    },
  },
  created() {
    this.fetchCartItems();
  },
  methods: {
    async fetchCartItems() {
      this.loading = true;
      try {
        const response = await ShoppingCartApi.getCart(this.userId);
        if (response.data.code === 200) {
          this.cartItems = response.data.data;
        } else {
          this.$message.error("获取购物车失败");
        }
      } catch (error) {
        console.error("获取购物车出错:", error);
        this.$message.error("获取购物车出错");
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(item, quantity) {
      try {
        const response = await ShoppingCartApi.updateCartItem(
          this.userId,
          item.ProductID,
          quantity
        );

        if (response.data.code === 200) {
          this.$message.success("更新数量成功");
        } else {
          this.$message.error(response.data.message || "更新数量失败");
          // 恢复原数量
          this.fetchCartItems();
        }
      } catch (error) {
        console.error("更新数量出错:", error);
        this.$message.error("更新数量出错");
        this.fetchCartItems();
      }
    },

    async removeItem(item) {
      try {
        const response = await ShoppingCartApi.removeFromCart(
          this.userId,
          item.ProductID
        );

        if (response.data.code === 200) {
          this.$message.success("商品已从购物车移除");
          this.fetchCartItems();
        } else {
          this.$message.error(response.data.message || "移除商品失败");
        }
      } catch (error) {
        console.error("移除商品出错:", error);
        this.$message.error("移除商品出错");
      }
    },

    async clearCart() {
      this.$confirm("确定要清空购物车吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const response = await ShoppingCartApi.clearCart(this.userId);
            if (response.data.code === 200) {
              this.$message.success("购物车已清空");
              this.cartItems = [];
              this.selectedItems = [];
            } else {
              this.$message.error(response.data.message || "清空购物车失败");
            }
          } catch (error) {
            console.error("清空购物车出错:", error);
            this.$message.error("清空购物车出错");
          }
        })
        .catch(() => {
          // 取消清空操作
        });
    },

    handleSelectionChange(selection) {
      this.selectedItems = selection;
    },

    selectAll() {
      this.$refs.cartTable.toggleAllSelection();
    },

    clearSelected() {
      if (this.selectedItems.length === 0) {
        this.$message.warning("请先选择要删除的商品");
        return;
      }

      this.$confirm("确定要删除选中的商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const promises = this.selectedItems.map((item) => {
            return ShoppingCartApi.removeFromCart(this.userId, item.ProductID);
          });

          try {
            await Promise.all(promises);
            this.$message.success("选中商品已删除");
            this.fetchCartItems();
          } catch (error) {
            console.error("删除选中商品出错:", error);
            this.$message.error("删除选中商品出错");
            this.fetchCartItems();
          }
        })
        .catch(() => {
          // 取消删除操作
        });
    },

    checkout() {
      if (this.selectedItems.length === 0) {
        this.$message.warning("请先选择要结算的商品");
        return;
      }

      // 这里可以跳转到结算页面，或者调用结算API
      this.$message.success("正在前往结算页面...");
      // this.$router.push('/checkout');
    },
  },
};
</script>

<style scoped>
.shopping-cart-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 80px; /* 为底部导航留出空间 */
}

.page-title {
  margin-bottom: 30px;
  font-size: 28px;
  color: #303133;
}

.loading-container {
  padding: 40px 0;
}

.empty-cart {
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 60px;
  color: #909399;
}

.empty-cart p {
  margin: 20px 0;
  font-size: 18px;
  color: #909399;
}

.product-info {
  display: flex;
  align-items: center;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
}

.product-details h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.price,
.subtotal {
  font-size: 16px;
  color: #f56c6c;
  font-weight: bold;
}

.cart-footer {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-actions {
  display: flex;
  gap: 10px;
}

.cart-total {
  display: flex;
  align-items: center;
}

.total-info {
  margin-right: 20px;
  text-align: right;
}

.total-info span {
  display: block;
  margin-bottom: 5px;
}

.total-price {
  font-size: 18px;
}

.total-price strong {
  color: #f56c6c;
  font-size: 24px;
}
</style>
