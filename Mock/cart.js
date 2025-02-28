import Mock from "mockjs";

// 购物车数据存储
const cartStorage = {};

// 添加商品到购物车
Mock.mock("/api/cart/add", "post", (options) => {
  const body = JSON.parse(options.body);
  const { userId, productId, quantity } = body;

  if (!userId || !productId) {
    return {
      code: 400,
      message: "参数错误",
      data: null,
    };
  }

  // 初始化用户购物车
  if (!cartStorage[userId]) {
    cartStorage[userId] = [];
  }

  // 检查商品是否已在购物车中
  const existingItemIndex = cartStorage[userId].findIndex(
    (item) => item.ProductID === productId
  );

  if (existingItemIndex > -1) {
    // 更新数量
    cartStorage[userId][existingItemIndex].Quantity += quantity || 1;
  } else {
    // 添加新商品
    cartStorage[userId].push({
      UserID: userId,
      ProductID: productId,
      Quantity: quantity || 1,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    });
  }

  return {
    code: 200,
    message: "添加成功",
    data: null,
  };
});

// 获取购物车
Mock.mock(new RegExp("/api/cart/get\\?userId=\\d+"), "get", (options) => {
  const userId = parseInt(options.url.split("=")[1]);

  if (!userId) {
    return {
      code: 400,
      message: "参数错误",
      data: [],
    };
  }

  // 获取用户购物车
  const userCart = cartStorage[userId] || [];

  // 为每个购物车项添加商品信息
  const cartWithProductInfo = userCart.map((item) => {
    return {
      ...item,
      product: Mock.mock({
        id: item.ProductID,
        title: "@ctitle(5, 10)",
        price: "@float(10, 1000, 2, 2)",
        image: "@image('200x200', '#FF6600')",
      }),
    };
  });

  return {
    code: 200,
    message: "获取成功",
    data: cartWithProductInfo,
  };
});

// 清空购物车
Mock.mock(new RegExp("/api/cart/clear\\?userId=\\d+"), "delete", (options) => {
  const userId = parseInt(options.url.split("=")[1]);

  if (!userId) {
    return {
      code: 400,
      message: "参数错误",
      data: null,
    };
  }

  // 清空用户购物车
  cartStorage[userId] = [];

  return {
    code: 200,
    message: "购物车已清空",
    data: null,
  };
});

// 更新购物车商品数量
Mock.mock("/api/cart/update", "put", (options) => {
  const body = JSON.parse(options.body);
  const { userId, productId, quantity } = body;

  if (!userId || !productId || quantity === undefined) {
    return {
      code: 400,
      message: "参数错误",
      data: null,
    };
  }

  // 检查用户购物车是否存在
  if (!cartStorage[userId]) {
    return {
      code: 404,
      message: "购物车不存在",
      data: null,
    };
  }

  // 查找商品
  const itemIndex = cartStorage[userId].findIndex(
    (item) => item.ProductID === productId
  );

  if (itemIndex === -1) {
    return {
      code: 404,
      message: "商品不在购物车中",
      data: null,
    };
  }

  // 更新数量
  cartStorage[userId][itemIndex].Quantity = quantity;
  cartStorage[userId][itemIndex].UpdatedAt = new Date().toISOString();

  return {
    code: 200,
    message: "更新成功",
    data: null,
  };
});

// 从购物车移除商品
Mock.mock("/api/cart/remove", "delete", (options) => {
  const body = JSON.parse(options.body);
  const { userId, productId } = body;

  if (!userId || !productId) {
    return {
      code: 400,
      message: "参数错误",
      data: null,
    };
  }

  // 检查用户购物车是否存在
  if (!cartStorage[userId]) {
    return {
      code: 404,
      message: "购物车不存在",
      data: null,
    };
  }

  // 移除商品
  const initialLength = cartStorage[userId].length;
  cartStorage[userId] = cartStorage[userId].filter(
    (item) => item.ProductID !== productId
  );

  if (cartStorage[userId].length === initialLength) {
    return {
      code: 404,
      message: "商品不在购物车中",
      data: null,
    };
  }

  return {
    code: 200,
    message: "移除成功",
    data: null,
  };
});

export default Mock;
