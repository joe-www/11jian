//index.js
//获取应用实例
const app = getApp()
var fifter = require("../libs/fifter.js")

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 身形管理
  gomeasurement() {
    const gom = (() => {
      wx.navigateTo({
        url: '../measurement/measurement',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    })
    fifter.HaveNoneNetWork(gom())

  },
  // 订单管理
  goorder() {
    const goo = (() => {
      wx.navigateTo({
        url: '../order/order',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    })
    fifter.HaveNoneNetWork(goo())

  },
  // 尺码管理
  gosize() {
    const gosize = (() => {
      wx.navigateTo({
        url: '../size/size',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    })
    fifter.HaveNoneNetWork(gosize())

  },
})
