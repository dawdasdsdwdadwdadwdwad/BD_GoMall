const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/BD_GoMall/" // 替换为您的仓库名
      : "/",
  configureWebpack: {
    // 确保在生产环境中也能正常使用 Mock.js
    devtool: "source-map",
  },
});
