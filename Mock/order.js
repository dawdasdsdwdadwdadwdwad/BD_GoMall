import Mock from "mockjs";

// 订单数据
const orderData = Mock.mock({
  "list|10": [
    {
      "id|+1": 100000,
      "userId|1-100": 1,
      orderNo: "@guid",
      createTime: "@datetime",
      "payStatus|0-2": 1, // 0未支付，1已支付，2已取消
      payTime: "@datetime",
      "totalAmount|1000-10000": 1000,
      "products|1-5": [
        {
          "id|+1": 1,
          title: "@ctitle(5, 10)",
          "price|100-1000": 100,
          "quantity|1-5": 1,
          image: '@image("100x100")',
        },
      ],
      address: {
        name: "@cname",
        phone: /^1[3-9]\d{9}$/,
        province: "@province",
        city: "@city",
        district: "@county",
        detail: "@ctitle(10, 30)",
      },
    },
  ],
});

// 获取订单列表
Mock.mock("/api/orders", "get", () => {
  return {
    code: 200,
    data: {
      total: orderData.list.length,
      items: orderData.list,
    },
    message: "获取成功",
  };
});

// 获取订单详情
Mock.mock(/\/api\/orders\/\d+/, "get", (options) => {
  const id = options.url.match(/\/api\/orders\/(\d+)/)[1];
  const order =
    orderData.list.find((item) => item.id == id) || orderData.list[0];

  return {
    code: 200,
    data: order,
    message: "获取成功",
  };
});

// 创建订单
Mock.mock("/api/orders", "post", () => {
  return {
    code: 200,
    data: {
      orderId: Mock.Random.increment(100000),
      orderNo: Mock.Random.guid(),
    },
    message: "创建成功",
  };
});

export default Mock;
