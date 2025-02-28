const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  //publicPath: "/BD_GoMall/",
  configureWebpack: {
    // 确保在生产环境中也能正常使用 Mock.js
    devtool: "source-map",
  },
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
});
