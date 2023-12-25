import { defineStore } from "pinia";
import * as Tools from "@/utils/tools/index";
// 1. 定义容器、导出容器
// 参数 1：容器的 ID，必须是唯一的，后面 Pinia 会把所有的容器挂载到根容器
// 参数 2：一些选项对象，也就是 state、getter 和 action
// 返回值：一个函数，调用即可得到容器实例

export const useMainStore = defineStore("main", {
  // 类似于 Vue2 组件中的 data，用于存储全局状态数据，但有两个要求
  // 1. 必须是函数，目的是为了在服务端渲染的时候避免交叉请求导致的数据状态污染
  // 2. 必须是箭头函数，这样是为了更好的 TS 类型推导
  state: () => {
    return {
      // 状态 1 购买 0 未购买
      status: 0,
      // 微信基础信息
      wxData: null,
      // 源
      type: "",
      // 用户信息
      user: null,
      access_token: "",
      nursery_id: "",
      // 是否是微信
      wherWx: null,
      // 地块 id
      farmPlotList: [],
      // 当前地块
      curFarmPlot: null,
      // 月份列表
      curMonthList: [],
      // 当前 footer
      curActive: null,
      // 土地详情
      masData: null,
    };
  },
  persist: true, // 添加 persist 属性
  getters: {
    getAccesToken: (state) => {
      const basics = Tools.storage("s", "get", "Basics");
      if (basics) {
        return basics;
      }
      if (state.access_token !== "") {
        return {
          access_token: state.access_token,
          n_id: state.nursery_id,
        };
      }
      return null;
    },
  },
  actions: {},
});
