<template>
  <div class="register-container">
    <el-card shadow="hover" class="register-card-container">
      <el-form :model="registerForm" ref="registerForm" :rules="rules">
        <el-form-item h1 class="elHeader1"> 注册 </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            prefix-icon="el-icon-message"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRegister">注册</el-button>
        </el-form-item>
        <el-form-item>
          <span>已经有账号?</span>
          <router-link to="/login" class="el-link el-link--primary"
            >立即登录</router-link
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { register } from "@/api/UserApi";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      registerForm: {
        username: "",
        email: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在3到8之间", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async submitRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          console.log(this.registerForm);
          try {
            register(this.registerForm)
              .then((response) => {
                console.log(response);
                this.$message.success("注册成功");
                this.$store.state.user.token = response.data.token;
                Cookies.set("usertoken", response.data.data.token, {
                  expires: 1,
                });
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (error) {
            console.log(error);
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  height: 100vh;
  .register-card-container {
    width: 400px;
  }
}
.elHeader1 {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  color: #303133;
}
</style>
