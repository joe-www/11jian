var app = getApp()
let url = app.globalData.baseUrl,
  openid, minmajor;
let loadpage = 1;
let couponArr = [],
  coupontemp = []; // 优惠券
Page({

  data: {
    payall: 0,
    coupondis: true,
    couponList: [],
    getMoreText: "正在加载更多", // 加载更多
  },

  // 选择优惠券
  usedBtn(e) {
    let that = this;
    wx.getNetworkType({
      success: function (res) {
        let networkdata = res.networkType;
        if (networkdata == 'none') {
          fifter.tips('', "当前无网络，请检查你的网络设置")
        }
        return
      }
    })
    let couponID = e.target.dataset.couponid;
    console.log('couponID')
    console.log(couponID)
    wx.setStorage({
      key: 'couponId',
      data: {
        id: e.target.dataset.id,
        couponid: e.target.dataset.couponid,
        full: e.target.dataset.full,
        reduce: e.target.dataset.reduce
      },
      success: function (res) {
        wx.navigateBack({
          delta: 1,
        })

      },
      fail: function (res) {},
      complete: function (res) {},
    })
    

  },
  // 加载更多
  getCouponMore(e) {
    if (e.type === "scrolltolower") {
      loadpage++;
    }

    this.getCouponRequest(10, loadpage, "unuse", minmajor)
    // setTimeout(() => {
    //   this.isCouponDis()
    // }, 200)
  },
  // 选择优惠券
  choseCoupon(id, fn) {
    let that = this;
    wx.request({
      url: url + 'useCoupon',
      data: {
        couponID: id,
        openID: openid
      },
      header: {},
      method: 'GET',
      dataType: '',
      success: function (res) {
        fn
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  // 获取优惠劵
  getCouponRequest(i, page, id, mid) {
    let that = this;
    wx.request({
      url: url + 'couponjson',
      data: {
        majorID: mid,
        openID: openid,
        status: id,
        pernum: i,
        page: page
      },
      header: {},
      method: 'GET',
      dataType: '',
      success: function (res) {
        if (res.errMsg === "request:ok") {
          if (id === "unuse") {
            that.setData({
              nouse: res.data.total
            })
          } else if (id === "used") {
            that.setData({
              used: res.data.total
            })
          } else {
            that.setData({
              expired: res.data.total
            })
          }

          if (page == 1) {
            coupontemp = res.data.data;
            that.setData({
              couponList: coupontemp
            })

          } else {
            coupontemp = coupontemp.concat(res.data.data)
            that.setData({
              couponList: coupontemp
            })

          }

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
        console.log('getlist');
        console.log(res);
        that.isCouponDis()

      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  // 判断金额
  isCouponDis() {
    let that = this;
    var min = (that.data.couponList[0].fullamount);
    let disarr = [];
    let dis = {}
    for (var i = 0; i < that.data.couponList.length; i++) {
      if (Number(that.data.couponList[i].fullamount) <= Number(that.data.payall)) {
        dis = {
          key: i,
          val: false
        }

      } else {
        dis = {
          key: i,
          val: true
        }

      }
      disarr.push(dis)
      that.setData({
        couponDis: disarr
      })
    }
    console.log('isc');

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    openid = app.globalData.openid;
    minmajor = app.globalData.majorid

    loadpage = 1;
    this.setData({
      payall: options.payall
    })
    console.log('payallval');
    console.log(this.data.payall);

    // 获取优惠券
    this.getCouponRequest(10, 1, "unuse", 1)
    // setTimeout(() => {

    //   console.log("minmajor:" + minmajor)
    //   this.isCouponDis()
    // }, 200)

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