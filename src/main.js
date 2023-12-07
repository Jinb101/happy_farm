import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/routes";

import ViewUIPlus from "view-ui-plus";
// 微信
import * as wxTools from "@/utils/tools/wxConfig.js";
// 工具类
import * as Tools from "@/utils/tools/index";
import { load } from "@/utils/tools/loading.js";
// 请求 axios -  http
import http from "@/api/api.js";
//Pinia
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// 视图组件
import shell from "@/components/shell/Shell.vue";

import "view-ui-plus/dist/styles/viewuiplus.css";
import "tailwindcss/tailwind.css";
import "vant/lib/index.css";
import "./style.css";

// vant
import {
  Button,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Skeleton,
  SkeletonTitle,
  SkeletonImage,
  SkeletonAvatar,
  SkeletonParagraph,
  NavBar,
  IndexBar,
  Divider,
  IndexAnchor,
  Empty,
  Cell,
  CellGroup,
  Toast,
  Image as VanImage,
  Picker,
  ActionSheet,
  Dialog,
  Sticky,
} from "vant";

const app = createApp(App);

// app 实例

//  Pinia 实例
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(Button);
app.use(Tabbar);
app.use(TabbarItem);
app.use(Divider);
app.use(Swipe);
app.use(SwipeItem);
app.use(Skeleton);
app.use(SkeletonTitle);
app.use(SkeletonImage);
app.use(SkeletonAvatar);
app.use(SkeletonParagraph);
app.use(NavBar);
app.use(IndexBar);
app.use(IndexAnchor);
app.use(Empty);
app.use(VanImage);
app.use(Cell);
app.use(CellGroup);
app.use(Toast);
app.use(ViewUIPlus);
app.use(Picker);
app.use(ActionSheet);
app.use(Sticky);
app.use(Dialog);

app.use(pinia).use(router);

app.component("shell", shell);

// 对象 挂载
app.provide("http", http);
app.provide("Tools", Tools);
app.provide("load", load);
app.provide("wxTools", wxTools);
app.mount("#app");