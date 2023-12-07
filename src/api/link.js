const TouristApi = {
  wx: "com/common/get_share", // 微信配置,
  // TODO: 微信配置信息
  getShare: "/api/login/get_share",
};

const MainApi = {
  login: "parents/vote/getComments",
  // TODO:轮播图
  banner: "farm/index/banner",
  // TODO: 获取我的地块
  myfarm: "farm/user/MyFarm",
  // TODO: 获取农场地块价格
  getPrice: "farm/common/GetSubscriptionPrice",
  // TODO: 获取农场地块价格
  getPay: "farm/common/getPaymentMethod",
  // TODO: 生成认购订单
  subscribe: "farm/user/subscribe",
  // TODO: 微信配置信息
  orderPay: "farm/user/OrderPayment",
  // TODO: 设置地块信息
  setPar: "farm/user/SetParcelInformation",
  // TODO: 设置地块产品信息
  addPro: "farm/user/AddProduct",
  // TODO: 删除地块产品信息
  deltPro: "farm/user/DeleteProduct",
  // TODO: 获取产品---种子列表
  obtPro: "farm/common/ObtainingProducts",
  // TODO: 获取我的产品---我的种子列表
  myobtPro: "farm/user/ObtainLandParcelProducts",
};

export { TouristApi, MainApi };
