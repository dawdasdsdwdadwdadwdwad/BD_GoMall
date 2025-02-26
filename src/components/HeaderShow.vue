<template>
  <div class="header">
    <div class="header-left">
      <router-link to="/" class="logo">
        <h1>E-Shop</h1>
      </router-link>
    </div>
    <div class="header-center">
      <el-input
        v-model="searchQuery"
        placeholder="搜索商品"
        prefix-icon="el-icon-search"
        @keyup.enter.native="handleSearch"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearch"
        ></el-button>
      </el-input>
    </div>
    <div class="header-right">
      <el-button icon="el-icon-setting" type="text" @click="goToProfile"
        >设置</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderShow",
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    handleSearch() {
      // TODO: 实现搜索逻辑
      console.log("搜索关键词：", this.searchQuery);
    },
    goToProfile() {
      this.$router.push("/profile");
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  flex: 1;
}

.header-center {
  flex: 2;
  max-width: 500px;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.logo {
  text-decoration: none;
  color: #409eff;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
}
</style>
