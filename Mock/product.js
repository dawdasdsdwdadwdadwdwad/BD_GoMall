import Mock from "mockjs";

// 商品数据
const productData = Mock.mock({
  "list|20": [
    {
      "id|+1": 1,
      title: "@ctitle(2, 6)",
      description: "@cparagraph(1, 3)",
      "price|1-10000": 100,
      "stock|10-100": 10,
      image: "@image()",
      category: '@pick(["电子产品", "服装", "食品", "家居"])',
      "sales|0-1000": 0,
      "rating|1-5": 4.5,
    },
  ],
});

// 获取商品列表
Mock.mock(/\/api\/products(\?.+)?$/, "get", (options) => {
  // 处理分页逻辑
  const url = new URL(options.url, "http://localhost");
  const page = parseInt(url.searchParams.get("page")) || 1;
  const pageSize = parseInt(url.searchParams.get("pageSize")) || 10;
  // 计算分页数据
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = productData.list.slice(start, end);
  return {
    code: 200,
    data: {
      total: productData.list.length,
      items: paginatedItems,
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

export { productData };
export default Mock;
