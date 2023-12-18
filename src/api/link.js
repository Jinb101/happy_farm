const TouristApi = {
  wx: "com/common/get_share", // 微信配置，
  // : 微信配置信息
  getShare: "/api/login/get_share",
};

const MainApi = {
  login: "parents/vote/getComments",
  // :轮播图
  banner: "farm/index/banner",
  // : 生成认购订单
  subscribe: "farm/user/subscribe",
  // : 微信配置信息
  orderPay: "farm/user/OrderPayment",

  // : 获取我的地块
  myfarm: "farm/user/MyFarm",
  // : 获取农场地块价格
  getPrice: "farm/common/GetSubscriptionPrice",
  // : 获取农场地块价格
  getPay: "farm/common/getPaymentMethod",
  // : 设置地块信息
  setPar: "farm/user/SetParcelInformation",
  // : 设置地块产品信息
  addPro: "farm/user/AddProduct",
  // : 删除地块产品信息
  deltPro: "farm/user/DeleteProduct",
  // : 地块详情
  masDeta: "farm/user/MassifDetails",

  // : 获取产品---种子列表
  obtPro: "farm/common/ObtainingProducts",
  // : 获取我的产品---我的种子列表
  myobtPro: "farm/user/ObtainLandParcelProducts",
  // : 删除地块蔬菜---删除地块蔬菜
  deletProu: "farm/user/DeleteProduct",

  // :  获取家庭成员
  family: "farm/user/familyMembers",
  // :  邀请家庭成员 -- 二维码
  qrCode: "farm/user/InviteFamilyMembersQRCode ",
  // :  获取家庭地址
  familyPath: "farm/user/address",
  // :  添加家庭地址
  addPath: "farm/user/addAddress",
  // :  添加家庭地址
  deletPath: "farm/user/deleteAddress",

  // : 接口：获取菜市
  foodMark: "farm/index/FoodMarket",
  // : 接口：菜市菜地熟菜列表
  cooked: "farm/index/CookedVegetables",

  // : 接口：每月可选
  monSele: "farm/user/MonthlyStatistics",
};

export { TouristApi, MainApi };
