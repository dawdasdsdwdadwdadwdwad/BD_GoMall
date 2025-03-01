import Vue from "vue";
import VueRouter from "vue-router";
import Cookies from "js-cookie";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    title: "首页",
    component: () => import("../views/dashboard/HotSale.vue"),
    meta: {
      requireAuth: false,
      showHeader: true,
      showFooter: true,
    },
  },
  {
    path: "/product/:id",
    title: "商品详情",
    component: () => import("../views/product/ProductDetail.vue"),
    meta: {
      requireAuth: false,
      showHeader: true,
      showFooter: true,
    },
  },
  {
    path: "/login",
    title: "登录",
    component: () => import("../views/LoginAndRegister/LoginAccounts.vue"),
    meta: {
      requireAuth: false,
      showHeader: false,
      showFooter: false,
    },
  },
  {
    path: "/profile",
    title: "个人资料",
    component: () => import("../views/profile/ProfileShow.vue"),
    meta: {
      requireAuth: true,
      showHeader: false,
      showFooter: true,
    },
  },
  {
    path: "/register",
    title: "注册",
    component: () => import("../views/LoginAndRegister/RegisterAccount.vue"),
    meta: {
      requireAuth: false,
      showHeader: false,
      showFooter: false,
    },
  },
  {
    path: "/cart",
    title: "购物车",
    component: () => import("../views/shoppingcar/ShoppingCar.vue"),
    meta: {
      requireAuth: false,
      showHeader: false,
      showFooter: true,
    },
  },
  {
    path: "/checkout",
    title: "结算",
    component: () => import("../views/checkout/CheckoutOrder.vue"),
    meta: {
      requireAuth: true,
      showHeader: false,
      showFooter: true,
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
  silentTransitionTo: true, //关闭警告
});
router.beforeEach((to, from, next) => {
  const token = Cookies.get("usertoken");
  const requireAuth = to.meta.requireAuth;

  if (requireAuth && !token) {
    router.push("/login");
  } else {
    return next();
  }
});
router.onError((err) => {
  // 如果是重定向错误，可以忽略它
  if (err.message.includes("Redirected when going from")) {
    console.log("处理了导航重定向");
    // 此处不需要额外处理，因为重定向已经发生
  } else {
    // 处理其他路由错误
    console.error("路由错误:", err);
  }
});
export default router;
