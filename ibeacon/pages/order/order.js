// pages/measurement/measurement.js
const app = getApp()
let url = app.globalData.baseUrl;
var fifter = require("../libs/fifter.js")
let loadpage = 1;
var ordertemp = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderlist: [],
    openid: '',
    getMoreText: "加载更多", // 加载更多
  },


  // 加载更多
  getOrderMore(e) {
    if (e.type === "scrolltolower") {
      loadpage++;
    }
  console.log('getmore');
    this.getorderlist(10, loadpage)
    
  },
  // 获取优惠劵
  getorderlist(i, page) {
    let that = this;
    wx.showLoading({
      title: '载入中'
    })
    wx.request({
      url: url + 'getuserorder',
      data: {
        openid: that.data.openid,
        pernum: i,
        page: page
      },
      header: {},
      method: 'GET',
      dataType: '',
      success: function (res) {
        if (res.errMsg === "request:ok") {
         
          wx.hideLoading()
          if (page == 1) {
            ordertemp = res.data.data;
            that.setData({
              orderlist: ordertemp
            })
          } else {
            ordertemp = ordertemp.concat(res.data.data)
            that.setData({
              orderlist: ordertemp
            })

          }
          console.log(res.data)

          if (page * 10 >= Number(res.data.total)) {
            that.setData({
              getMoreText: "我是有底限的"
            })
          } else {
            that.setData({
              getMoreText: "正在加载更多"
            })
          }
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var openid = app.globalData.openid;
    this.setData({
      openid: openid
    })
    
    this.getorderlist(10, 1)
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})