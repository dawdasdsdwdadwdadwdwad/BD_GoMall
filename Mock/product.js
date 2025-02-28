import Mock from "mockjs";

// 商品数据
const productData = Mock.mock({
  "list|20": [
    {
      "id|+1": 1,
      title: "@ctitle(5, 10)",
      description: "@cparagraph(1, 3)",
      "price|100-10000": 100,
      "stock|10-100": 10,
      image: '@image("200x200", "#FF6600")',
      category: '@pick(["电子产品", "服装", "食品", "家居"])',
      "sales|0-1000": 0,
      "rating|1-5": 4.5,
    },
  ],
});

// 获取商品列表
Mock.mock(/\/api\/products(\?.+)?$/, "get", () => {
  // 这里可以处理分页、筛选等逻辑
  return {
    code: 200,
    data: {
      total: productData.list.length,
      items: productData.list,
    },
    message: "获取成功",
  };
});

// 获取商品详情
Mock.mock(/\/api\/products\/\d+/, "get", (options) => {
  // 从URL中提取商品ID
  const id = options.url.match(/\/api\/products\/(\d+)/)[1];
  const product =
    productData.list.find((item) => item.id == id) || productData.list[0];

  return {
    code: 200,
    data: product,
    message: "获取成功",
  };
});

export default Mock;
