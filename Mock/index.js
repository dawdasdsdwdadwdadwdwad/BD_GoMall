import Mock from "mockjs";

// 设置全局延时
Mock.setup({
  timeout: "200-600",
});

// 导入各模块
import "./user";
import "./product";
import "./order";
import "./cart";
// 可以在这里添加一些通用的 mock 配置

export default Mock;
