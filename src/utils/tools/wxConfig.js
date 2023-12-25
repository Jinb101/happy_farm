// wx.config.js
import wx from "weixin-jsapi";
// 请求 axios -  http
import http from "@/api/api.js";

// 新增微信分享配置
export function setWxShareConfig(title, desc, link, imgUrl) {
  wx.ready(() => {
    wx.updateAppMessageShareData({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        console.log("分享配置成功");
      },
      fail: function (res) {
        console.log("配置失败", res);
      },
    });
    wx.updateTimelineShareData({
      title: title, // 分享标题
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        console.log("分享配置成功");
      },
      fail: function (res) {
        console.log("分享配置失败", res);
      },
    });
  });
}
// 使用方法
// 在需要分享的页面中调用 setWxShareConfig 方法
// setWxShareConfig("分享标题", "分享��述", "分享链接", "分享图标链接");

// 土地支付
export async function wxPay(params) {
  return new Promise((resolve, reject) => {
    // 发起请求获取签名
    http.post("orderPay", params).then((data) => {
      if (data.code === 200) {
        let userData = data.data.jsApi_request;
        // 配置微信 JS SDK
        wx.config({
          debug: false,
          appId: userData.appId,
          timestamp: userData.timestamp,
          nonceStr: userData.nonceStr,
          signature: userData.sign,
          jsApiList: ["chooseWXPay"],
        });
        // 配置完成后调用微信支付
        wx.chooseWXPay({
          timestamp: userData.timestamp,
          nonceStr: userData.nonceStr,
          package: userData.package,
          signType: userData.signType,
          paySign: userData.sign,
          success: (res) => {
            // 支付成功时返回 resolve
            resolve(res);
          },
          fail: (err) => {
            // 支付失败时返回 reject
            reject(err);
          },
        });
      }
    });
  });
}

export async function seedWxPay(params) {
  return new Promise((resolve, reject) => {
    // 发起请求获取签名
    wx.config({
      debug: false,
      appId: params.appId,
      timestamp: params.timestamp,
      nonceStr: userData.nonceStr,
      signature: data.sign,
      jsApiList: ["chooseWXPay"],
    });
    // 配置完成后调用微信支付
    wx.chooseWXPay({
      timestamp: params.timestamp,
      nonceStr: userData.nonceStr,
      package: userData.package,
      signType: userData.signType,
      paySign: userData.sign,
      success: (res) => {
        // 支付成功时返回 resolve
        resolve(res);
      },
      fail: (err) => {
        // 支付失败时返回 reject
        reject(err);
      },
    });
  });
}
