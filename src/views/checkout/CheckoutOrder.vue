<template>
  <div class="checkout-container">
    <h1 class="page-title">确认订单</h1>

    <!-- 收货地址 -->
    <el-card class="address-section">
      <div slot="header" class="card-header">
        <span>收货地址</span>
        <el-button type="text" @click="showAddressDialog = true"
          >添加新地址</el-button
        >
      </div>
      <div v-if="addresses.length > 0" class="address-list">
        <el-radio-group v-model="selectedAddress">
          <el-radio
            v-for="address in addresses"
            :key="address.id"
            :label="address.id"
            class="address-item"
          >
            <div class="address-info">
              <p class="contact">{{ address.name }} {{ address.phone }}</p>
              <p class="detail">
                {{ address.province }}{{ address.city }}{{ address.district
                }}{{ address.detail }}
              </p>
            </div>
          </el-radio>
        </el-radio-group>
      </div>
      <div v-else class="empty-address">
        <p>暂无收货地址，请添加</p>
      </div>
    </el-card>

    <!-- 商品列表 -->
    <el-card class="order-section">
      <div slot="header" class="card-header">
        <span>商品清单</span>
      </div>
      <el-table :data="selectedItems" style="width: 100%">
        <el-table-column label="商品信息">
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
        <el-table-column label="数量" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.Quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120">
          <template slot-scope="scope">
            <span class="subtotal"
              >¥{{ scope.row.product.price * scope.row.Quantity }}</span
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 支付方式 -->
    <el-card class="payment-section">
      <div slot="header" class="card-header">
        <span>支付方式</span>
      </div>
      <el-radio-group v-model="paymentMethod">
        <el-radio label="alipay">支付宝</el-radio>
        <el-radio label="wechat">微信支付</el-radio>
        <el-radio label="card">银行卡</el-radio>
      </el-radio-group>
    </el-card>

    <!-- 订单总结 -->
    <div class="order-summary">
      <div class="summary-item">
        <span>商品总计：</span>
        <span class="price">¥{{ totalPrice }}</span>
      </div>
      <div class="summary-item">
        <span>运费：</span>
        <span class="price">¥{{ shippingFee }}</span>
      </div>
      <div class="summary-item total">
        <span>应付总额：</span>
        <span class="price">¥{{ totalPrice + shippingFee }}</span>
      </div>
      <el-button
        type="primary"
        size="large"
        @click="submitOrder"
        :loading="submitting"
        >提交订单</el-button
      >
    </div>

    <!-- 新增地址对话框 -->
    <el-dialog
      title="新增收货地址"
      :visible.sync="showAddressDialog"
      width="500px"
    >
      <el-form
        :model="newAddress"
        :rules="addressRules"
        ref="addressForm"
        label-width="100px"
      >
        <el-form-item label="收货人" prop="name">
          <el-input v-model="newAddress.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="newAddress.phone"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="region">
          <el-cascader
            v-model="newAddress.region"
            :options="regionOptions"
            placeholder="请选择所在地区"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input type="textarea" v-model="newAddress.detail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CheckoutOrder",
  data() {
    return {
      selectedAddress: "",
      addresses: [],
      paymentMethod: "alipay",
      shippingFee: 10,
      submitting: false,
      showAddressDialog: false,
      newAddress: {
        name: "",
        phone: "",
        region: [],
        detail: "",
      },
      addressRules: {
        name: [
          { required: true, message: "请输入收货人姓名", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
        region: [
          { required: true, message: "请选择所在地区", trigger: "change" },
        ],
        detail: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      regionOptions: [], // 省市区数据
    };
  },
  computed: {
    ...mapGetters("cart", ["getSelectedItems", "getTotalPrice"]),
    selectedItems() {
      return this.getSelectedItems;
    },
    totalPrice() {
      return this.getTotalPrice;
    },
  },
  created() {
    this.loadAddresses();
    this.loadRegionData();
  },
  methods: {
    async loadAddresses() {
      // 模拟加载地址数据
      this.addresses = [
        {
          id: 1,
          name: "张三",
          phone: "13800138000",
          province: "广东省",
          city: "深圳市",
          district: "南山区",
          detail: "科技园南路XX号",
        },
      ];
      if (this.addresses.length > 0) {
        this.selectedAddress = this.addresses[0].id;
      }
    },
    loadRegionData() {
      // 模拟省市区数据
      this.regionOptions = [
        {
          value: "guangdong",
          label: "广东省",
          children: [
            {
              value: "shenzhen",
              label: "深圳市",
              children: [
                {
                  value: "nanshan",
                  label: "南山区",
                },
              ],
            },
          ],
        },
      ];
    },
    async saveAddress() {
      this.$refs.addressForm.validate(async (valid) => {
        if (valid) {
          // 模拟保存地址
          const newAddress = {
            id: this.addresses.length + 1,
            name: this.newAddress.name,
            phone: this.newAddress.phone,
            province: this.newAddress.region[0],
            city: this.newAddress.region[1],
            district: this.newAddress.region[2],
            detail: this.newAddress.detail,
          };
          this.addresses.push(newAddress);
          this.selectedAddress = newAddress.id;
          this.showAddressDialog = false;
          this.$message.success("地址添加成功");
        }
      });
    },
    async submitOrder() {
      if (!this.selectedAddress) {
        this.$message.warning("请选择收货地址");
        return;
      }

      this.submitting = true;
      try {
        // 模拟订单提交
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.$message.success("订单提交成功");
        this.$router.push("/order/success");
      } catch (error) {
        console.error("提交订单失败:", error);
        this.$message.error("提交订单失败，请重试");
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.checkout-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 30px;
  font-size: 28px;
  color: #303133;
}

.el-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.address-item {
  display: block;
  margin-bottom: 10px;
}

.address-info {
  margin-left: 10px;
}

.contact {
  font-weight: bold;
  margin-bottom: 5px;
}

.detail {
  color: #606266;
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
  color: #f56c6c;
  font-weight: bold;
}

.payment-section .el-radio {
  margin-right: 30px;
}

.order-summary {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total {
  font-size: 18px;
  font-weight: bold;
  border-top: 1px solid #dcdfe6;
  padding-top: 10px;
  margin-top: 10px;
}

.el-button--large {
  width: 200px;
  margin-top: 20px;
}

.empty-address {
  text-align: center;
  padding: 20px;
  color: #909399;
}
</style>
