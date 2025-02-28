const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  //publicPath: "/BD_GoMall/",
  configureWebpack: {
    // 确保在生产环境中也能正常使用 Mock.js
    devtool: "source-map",
  },
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/BD_GoMall/" // 替换为您的GitHub仓库名称
      : "/",
  outputDir: "dist",
  assetsDir: "static",
});
