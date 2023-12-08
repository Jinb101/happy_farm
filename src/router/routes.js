import { createRouter, createWebHistory } from "vue-router";
import { defineStore } from "pinia";
import { useMainStore } from "@/store/index.js";

let prefix_title = "";
let after_title = "";

const routesConfig = [
  // 动态添加的路由配置对象
  // path, component,name,title,footer,header,header_right
  ["/login", "login/index.vue", "login", "登录", false, false],
  ["/fram", "fram/index.vue", "fram", "云土地", true, false],
  ["/har", "har/index.vue", "har", "菜市", true, false],
  ["/seed", "fram/seed.vue", "seed", "种子列表", false, true],
  ["/veg", "fram/veg.vue", "veg", "我的蔬菜", false, true],
  ["/mature", "fram/mature.vue", "mature", "成熟列表", false, true],

  ["/user", "user/index.vue", "user", "我的", true, false],
  ["/path", "user/path.vue", "path", "地址铺", false, true, "none"],
  ["/family", "user/family.vue", "family", "家庭成员", false, true, "family"],
];

const toRoute = ([
  path,
  component,
  name,
  title,
  isTab,
  hasHeader,
  type,
  keepAlive,
  to,
  children,
]) => ({
  path,
  name,
  meta: {
    title: prefix_title + title + after_title,
    to: to ?? "",
    name,
    type: type ?? "farm",
    tab: isTab ?? false,
    hea: hasHeader ?? true,
  },
  component: () =>
    import(/* @vite-ignore */ `../view/${component}`).then(
      (module) => module.default
    ),
  ...(keepAlive ? { meta: { keepAlive: true } } : {}),
  ...(children ? { children: children.map(toRoute) } : {}),
});

const routes = routesConfig.map(toRoute);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/start",
    },
    {
      name: "start",
      path: "/start",
      component: () => import("@/view/start/index.vue"),
    },
  ],
});

routes.forEach((route) => router.addRoute(route));

router.beforeEach((to, from, next) => {
  const store = useMainStore();
  if (!store.access_token && to.path !== "/start") {
    next("/start");
  } else {
    next();
  }
});

router.afterEach((route) => {
  if (route.meta.title) {
    document.title = route.meta.title;
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      const hackIframe = document.createElement("iframe");
      hackIframe.style.display = "none";
      hackIframe.src =
        process.env.NODE_ENV === "development"
          ? "../../../"
          : "./" + "utils/static/html/fixIosTitle.html?r=" + Math.random();
      document.body.appendChild(hackIframe);
      setTimeout((_) => {
        document.body.removeChild(hackIframe);
      }, 300);
    }
  }
});

export default router;
