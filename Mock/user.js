import Mock from "mockjs";

// 用户数据
const userData = Mock.mock({
  "list|10": [
    {
      "id|+1": 1,
      username: "@cname",
      email: "@email",
      avatar: '@image("200x200")',
      role: '@pick(["admin", "user"])',
      createTime: "@datetime",
    },
  ],
});

// 注册接口
Mock.mock("/api/auth/register", "post", (options) => {
  const body = JSON.parse(options.body);
  return {
    code: 200,
    data: {
      token: Mock.Random.guid(),
      userId: Mock.Random.id(),
      username: body.username || Mock.Random.cname(),
    },
    message: "注册成功",
  };
});

// 登录接口
Mock.mock("/api/auth/login", "post", (options) => {
  const body = JSON.parse(options.body);
  if (!body.username) {
    return {
      code: 401,
      data: {},
      message: "用户名不能为空",
    };
  }
  return {
    code: 200,
    data: {
      token: Mock.Random.guid(),
      userId: Mock.Random.id(),
      username: body.username || "默认用户",
    },
    message: "登录成功",
  };
});

// 获取用户信息
Mock.mock("/api/user/info", "get", () => {
  return {
    code: 200,
    data: userData.list[0],
    message: "获取成功",
  };
});

export default Mock;
