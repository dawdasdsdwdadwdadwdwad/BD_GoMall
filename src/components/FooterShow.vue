<template>
  <el-menu
    class="Footermenu"
    mode="horizontal"
    background-color="white"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/cart">购物车</el-menu-item>
    <el-menu-item index="/profile">我的</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "FooterShow",
  methods: {
    handleSelect(index) {
      this.$router.push(index);
    },
  },
};
</script>

<style lang="scss" scoped>
.Footermenu {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  justify-content: space-around;
  border-top: 1px solid grey;
}
</style>
