// pages/measurement/measurement.js
const app = getApp()
let url = app.globalData.baseUrl;
var fifter = require("../libs/fifter.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bodylist:[],
    items: [
      { name: '男', value: '1', checked: 'true'  },
      { name: '女', value: '0'}
    ],
    sex:1,
    openid:''
  },
  formSubmit: function (e) {
    var list = e.detail.value;
    for (var key in list){
      if(list[key] == ''){
        fifter.tips("", "请输入完整信息")
        return false;
      }
    }
    var data = list;
    data.sex = this.data.sex;
    data.openid = this.data.openid;
    console.log(data);
    wx.showLoading({
      title: '保存中'
    })
    wx.request({
      url: url + 'saveBodyData',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        console.log('修改身形结果');
        console.log(res);
        if(res){
          wx.hideLoading()
          const gom = (() => {
            wx.navigateBack()
          })
          fifter.HaveNoneNetWork(gom())
        }
      },
      fail: function (res) {
        console.log('saveshenmingfail')
        console.log(res)
       },
      complete: function (res) { },
    })
    
  },

  radioChange: function (e) {
    if(e.detail.value == 0){
      this.setData({
        sex:0
      })
    }else{
      this.setData({
        sex: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('mopenid')
    console.log(app.globalData.openid)
    
    this.setData({
      openid:app.globalData.openid
    })
    wx.showLoading({
      title: '载入中'
    })
    let that = this;
    wx.request({
      url: url + 'getBodyData',
      data: {
        openid:that.data.openid
      },
      header: {},
      method: 'GET',
      dataType: '',
      success: function (res) {
        console.log('measurementRequest')
        console.log(res);
        if (res.data) {
          // console.log(res)
          that.setData({
            bodylist: res.data.bodylist,
            sex: res.data.sex
          })
          console.log(res.data.sex)
          
          if(res.data.sex=='女'){
            that.setData({
              items: [{ name: '男', value: '1' },
                { name: '女', value: '0', checked: 'true' }
                      ]
            })
          }else{
            that.setData({
              items: [{ name: '男', value: '1', checked: 'true' },
              { name: '女', value: '0' }
              ]
            })
          }
        }
        wx.hideLoading()
        
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
    console.log(1111111)
  
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