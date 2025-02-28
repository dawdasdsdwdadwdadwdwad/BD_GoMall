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
      requireAuth: true,
      showHeader: false,
      showFooter: true,
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});
router.beforeEach((to, from, next) => {
  const token = Cookies.get("usertoken");
  if (to.meta.requireAuth && !token) {
    next("/login");
  } else if (to.meta.requireAuth && token) {
    next();
  } else {
    next();
  }
});
export default router;
