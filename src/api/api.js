import axios from "axios";
import { TouristApi, MainApi } from "./link";
import qs from "qs";
import { createPinia } from "pinia";
import { useMainStore } from "../store/index.js";
// import store from "@/store/index.js";
// 工具类
// import * as Tools from "@/utils/tools/index";
// import route from "@/router/routes.js";
// import { load } from "@/utils/tools/loading.js";

// 请求源地址
let prefix = window.location.origin;
let devUrl = "http://test.lide.jsxrk.xin";
let envUrl = "http://lide.jsxrk.xin";
// 状态管理
const pinia = createPinia();
const mainStor = useMainStore(pinia);
const env = import.meta.env.DEV;

// console.log(import.meta.env, env, process.env.NODE_ENV, "-------");
console.log(env, import.meta.env);
// 创建一个 Axios 实例
const http = axios.create({
  baseURL: env ? devUrl : envUrl, // 设置基本的请求地址
  timeout: 5000, // 设置请求超时时间
});
// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (config.timeout !== 5000) {
      let x = config.data;
      if (x) {
        x = qs.parse(x);
      } else {
        x = {};
      }
      config.data = qs.stringify(x);
    }
    // 这里可以添加一些请求拦截前的逻辑，比如添加请求头、处理请求参数等
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    let code = response.data.code * 1;
    let c = 0;
    switch (code) {
      case 200:
        return response.data;
      case 400: // 登录失效
      case 404: // 登录失效
      case 401: // 登录失效
        c = 400;
        break;
      case 402: // 该账号未申请老师，请申请为老师
        c = 402;
        break;
      case 403: // 该账号审核中
        c = 403;
        break;
      case 405: // 该账号审核未通过
        c = 405;
        break;
      case 408: // 该账号已禁用
        c = 408;
        break;
      case 410: // token 已过期
        c = 410;
        break;
      default:
    }
    if (c > 0) {
      //   store.dispatch("setUserStatus", c);
    }
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 获取请求头的函数
function getHeaders() {
  const getAccesToken = mainStor.getAccesToken;
  return {
    "access-token": getAccesToken.access_token,
    "nursery-id": getAccesToken.n_id,
    "Content-Type": "application/json",
  };
}

// 封装 get 请求
function get(url, params) {
  const api = { ...TouristApi, ...MainApi };
  const apiUrl = api[url];
  if (!apiUrl) {
    return Promise.reject(new Error("Invalid API url"));
  }

  // 获取请求头
  const headers = getHeaders();

  // 发起 get 请求并添加请求头
  return http.get(apiUrl, { params, headers });
}

// 封装 post 请求
function post(url, data) {
  const api = { ...TouristApi, ...MainApi };
  const apiUrl = api[url];
  if (!apiUrl) {
    return Promise.reject(new Error("Invalid API url"));
  }

  // 获取请求头
  const headers = getHeaders();
  // 发起 post 请求并添加请求头
  return http.post(apiUrl, data, { headers });
}

export default {
  get,
  post,
};
