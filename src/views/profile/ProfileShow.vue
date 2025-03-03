<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <div slot="header" class="card-header">
        <h2>个人资料</h2>
      </div>
      <div class="profile-content">
        <div class="avatar-section">
          <el-avatar :size="100" icon="el-icon-user-solid"></el-avatar>
          <el-button type="text" class="change-avatar-btn">更换头像</el-button>
        </div>
        <el-form :model="profileForm" label-width="80px" class="profile-form">
          <el-form-item label="用户名">
            <el-input v-model="profileForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="profileForm.email" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="profileForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input type="textarea" v-model="profileForm.address"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveProfile">保存修改</el-button>
            <el-button type="danger" @click="logout">退出登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ProfileShow",
  data() {
    return {
      profileForm: {
        labelPosition: "left",
        username: "User001",
        email: "user001@example.com",
        phone: "",
        address: "",
      },
    };
  },
  methods: {
    ...mapActions("cart", ["clearCart"]),
    saveProfile() {
      // TODO: 实现保存个人资料的逻辑
      this.$message.success("个人资料已更新");
    },
    async logout() {
      try {
        // 清除购物车数据
        await this.$store.dispatch("cart/clearCart");
        // 清除用户token
        this.$store.dispatch("user/setToken", "");
        // 清除cookie（如果有使用cookie存储token）
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        // 提示用户
        this.$message.success("已成功退出登录");
        // 重定向到登录页面
        this.$router.push("/login");
      } catch (error) {
        console.error("退出登录失败:", error);
        this.$message.error("退出登录失败，请重试");
      }
    },
  },
};
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-card {
  width: 100%;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.change-avatar-btn {
  margin-top: 10px;
}

.profile-content {
  padding: 20px;
}

.profile-form {
  max-width: 600px;
  margin: 0 auto;
}

.profile-form .el-form-item {
  margin-bottom: 20px;
  width: 100%;
}

.profile-form .el-input,
.profile-form .el-textarea {
  width: 100%;
}
</style>
