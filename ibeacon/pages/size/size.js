// pages/size/size.js
const app = getApp()
let url = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sizelist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('mopenid')
    console.log(app.globalData.openid)

    this.setData({
      openid: app.globalData.openid
    })
    wx.showLoading({
      title: '载入中'
    })
    let that = this;
    wx.request({
      url: url + 'getSizeData',
      data: {
        openid: that.data.openid
      },
      header: {},
      method: 'GET',
      dataType: '',
      success: function (res) {
        console.log('personres')
        console.log(res);
        if (res.data) {
          // console.log(res)
          that.setData({
            sizelist: res.data,
          })
          console.log(res.data.sex)
          wx.hideLoading()
        }
      },
      fail: function (res) {
      },
      complete: function (res) {
      },
    })
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