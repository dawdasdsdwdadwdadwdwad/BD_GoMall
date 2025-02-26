<template>
  <div class="login-container">
    <el-card class="login-card">
      <div slot="header" class="card-header">
        <h2>登录</h2>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          <el-link type="primary" class="forget-pwd" href="javascript:;"
            >忘记密码？</el-link
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-btn"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="register-link">
          <span>还没有账号？</span>
          <router-link to="/register" class="el-link el-link--primary"
            >立即注册</router-link
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { login } from "@/api/UserApi";
import Cookies from "js-cookie";
export default {
  name: "LoginAccounts",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        remember: false,
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          login(this.loginForm)
            .then((response) => {
              // console.log(response);
              // console.log(response.data);
              // console.log(response.data.data);
              Cookies.set("usertoken", response.data.token, { expires: 1 });
              this.$store.state.user.token = response.data.token;
              this.$message.success("登录成功");
              this.$router.push("/");
              this.$store.state.user.token = response.data.data.token;
              Cookies.set("usertoken", response.data.data.token, {
                expires: 1,
              });
            })
            .catch((error) => {
              console.error("登录失败:", error);
              this.$message.error("登录失败，请检查邮箱和密码");
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.card-header {
  text-align: center;
}

.login-btn {
  width: 100%;
}

.forget-pwd {
  float: right;
}

.register-link {
  text-align: center;
}
</style>
