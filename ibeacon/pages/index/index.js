//index.js
//获取应用实例
var app = getApp()
var fifter = require("../libs/fifter.js")
let appid = app.globalData.appid,
  appsecret = app.globalData.appsecret;
let url = app.globalData.baseUrl;
let openid;
let access_token, formId;
let loadpage = 1; // 翻页 
let couponArr = [],
  coupontemp = []; // 优惠券
Page({

  data: {
    navid: 1,
    lookId: 0, // 查看id
    nouse: 0,
    used: 0,
    expired: 0,
    minmajor: "",
    minorid: "",
    shopinfo: [], // 商家数据
    main_show: true, // 隐藏查看详情
    noneSeller: false, // 无商家
    couponMore: {}, // 优惠券详情
    getMoreText: "正在加载更多", // 加载更多
    couponList: [],
    tempmajor:0,
  },
  // 加载更多
  getCouponMore(e) {
    let setin = e.target.dataset.in;
    if (e.type === "scrolltolower") {
      loadpage++;
    }
    if (setin == 1) {
      this.getCouponRequest(5, loadpage, "unuse", this.data.minmajor,1)
    } else if (setin == 2) {
      this.getCouponRequest(5, loadpage, "used", this.data.minmajor,1)
    } else {
      this.getCouponRequest(5, loadpage, "expire", this.data.minmajor,1)
    }

  },

  // 去买单
  gopay() {
    const test = (() => {
      wx.navigateTo({
        url: '../pay/pay',
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {},
      })
    })
    fifter.HaveNoneNetWork(test())

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
  // 立即使用
  nowUsed(e) {
    let that = this;
    let couponID = e.target.dataset.couponid;
    const used = (() => {
      wx.setStorage({
        key: 'couponId',
        data: {
          id: e.target.dataset.id,
          couponid: e.target.dataset.couponid,
          full: e.target.dataset.full,
          reduce: e.target.dataset.reduce
        },
        success: function (res) {
          wx.navigateTo({
            url: '../pay/pay',
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
          })
        },
        fail: function (res) {},
        complete: function (res) {},
      })
    })

    fifter.HaveNoneNetWork(used())

  },
  // 获取优惠劵
  getCouponRequest(i, page, id, mid,getcontent) {
    openid = app.globalData.openid;
    
    // console.log('mid')
    // console.log(mid);
    // console.log('openid');
    // console.log(openid)
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
          console.log('getCouponRequest')
          console.log(res);
          if (!res.data.data) {
            fifter.toast(res.data.msg)
            return;
          }
          if (id === "unuse") {
            that.setData({
              nouse: res.data.total
            })
            that.setData({
              navid: 1
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
          if(getcontent==0){
            return;
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
          if (page * 5 >= Number(res.data.total)) {
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
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  // nav bar
  navBtn(e) {

    let that = this;
    const nav = (() => {
      loadpage = 1;
      that.setData({
        navid: e.target.dataset.id,
        getMoreText: "正在加载更多",
        couponList: []
      })
      if (that.data.navid == 1) {
        that.getCouponRequest(5, 1, "unuse", that.data.minmajor,1)
      } else if (that.data.navid == 2) {
        that.getCouponRequest(5, 1, "used", that.data.minmajor,1)
      } else {
        that.getCouponRequest(5, 1, "expire", that.data.minmajor,1)
      }
    })

    fifter.HaveNoneNetWork(nav())
  },
  // 查看
  usedBtn(e) {
    let that = this;
    let Lid = e.target.dataset.id;
    let data = that.data.couponList;

    let lookobj = {
      id: data[Lid].id,
      couponid: data[Lid].id,
      full: data[Lid].fullamount,
      reduce: data[Lid].reduceamount,
      title: data[Lid].info,
      time: data[Lid].title,
      explain: data[Lid].explain,
      des: data[Lid].instructions
    }
    that.setData({
      lookId: Lid,
      couponMore: lookobj,
      main_show: false
    })
  },
  // 关闭查看
  closeBtn() {
    this.setData({
      main_show: true
    })
  },

  // 搜索ibeacon
  getIbeacon() {
    let that = this;
    wx.startBeaconDiscovery({
      uuids: ["B5B182C7-EAB1-4988-AA99-B5C1517008D9"],
      success: function (res) {
        wx.onBeaconUpdate(function (res) {
          // console.log('beacons')
          // console.log(t)
          // let t = res.beacons;
          // let min = Number(t[0].accuracy);
          // let Major = Number(t[0].major);
          // let Minor = Number(t[0].minor);
          // if (t.length == 1) {
          //   that.setData({
          //     minmajor: Major,
          //     minorid: Minor,
          //     noneSeller: false
          //   })
          //   app.globalData.minmajor = Major
          // } else if (t.length !== 0) {

          //   for (var i = 1; i < t.length; i++) {
          //     if (Number(t[i].accuracy) < min) {
          //       Major = Number(t[i].major)
          //       Minor = Number(t[i].minor)
          //       that.setData({
          //         minmajor: Major,
          //         minorid: Minor,
          //         noneSeller: false
          //       })
          //       app.globalData.minmajor = Major;

          //     } else {
          //       that.setData({
          //         minmajor: t[0].major,
          //         minorid: t[0].minor,
          //         noneSeller: false
          //       })
          //     }

          //   }
          // }
          let t = res.beacons;
          if(t.length>=1){
            let min = Number(t[0].accuracy);
            let Major = Number(t[0].major);
            let Minor = Number(t[0].minor);
            
            for (var i = 1; i < t.length; i++) {
              if (Number(t[i].accuracy) < min) {
                min = Number(t[i].accuracy)
                Major = Number(t[i].major)
                Minor = Number(t[i].minor)
              } 

            }
            that.setData({
              minmajor: Major,
              minorid: Minor,
              noneSeller: false
            })
            app.globalData.minmajor = Major
            var need_upload = true;
           
            
            wx.hideLoading()
            // 当切换商店时重新获取商家信息和优惠券
            if ((that.data.tempmajor !== that.data.minmajor) || that.data.shopinfo.name == null){
              console.log('suctemp');
              console.log(that.data.tempmajor)
              console.log(that.data.minmajor)
              that.getShopInfo(that.data.minmajor)
              if(app.globalData.openid !=null){
                that.getCouponRequest(5, 1, "expire", that.data.minmajor,0)
                that.getCouponRequest(5, 1, "used", that.data.minmajor,0)
                that.getCouponRequest(5, 1, "unuse", that.data.minmajor,1)
                that.setData({
                  tempmajor: that.data.minmajor
                })
              }
              
              
            }
            // that.getAnyMinor(that.data.minmajor, that.data.minorid)
          }
           
          wx.onBeaconServiceChange(function (res) {
            console.log("设备服务状态改变")
            console.log(res)
            if (res.available == false) {
              that.setData({
                noneSeller: true
              })
              console.log('clearInterval');
              clearInterval(that.data.timer);
            }
          })
          wx.getBeacons({
            success: function (res) {
              // console.log("getbeacon")
              // console.log(res)
            },
            fail: function (res) {},
            complete: function (res) {},
          })

        })
      },
      fail: function (res) {
        console.log('开启设备搜索失败')
        console.log(res)
        that.setData({
          noneSeller: true
        })
        fifter.tips("", "请关闭微信重新进入小程序")
      },
      complete: function (res) {},
    })

  },
  // 收集minor
  getAnyMinor(maj, mor) {
    let that = this;
    openid = app.globalData.openid;
    var data =  {
        minorID: mor,
      majorID: maj,
      openID: openid
      }
    // console.log('收集minor')
    // console.log(data)
    
    wx.request({
      url: url + 'collectMinor',
      data: data,
      header: {},
      method: 'GET',
      dataType: '',
      success: function (res) {
        // console.log('收集minor结果');
        // console.log(res);
        // console.log('getAnyMinor')
        // console.log(res)
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  // 获取商家信息
  getShopInfo(id) {
    let that = this;
    wx.request({
      url: url + 'shopInfo',
      data: {
        uuid: "B5B182C7-EAB1-4988-AA99-B5C1517008D9",
        majorID: id,
        openID: app.globalData.openid
      },
      header: {},
      method: 'GET',
      dataType: '',
      success: function (res) {
        console.log('getShopInfo')
        console.log(res)
        if (res.errMsg === "request:ok") {
          if (res.data.name) {
            wx.hideLoading()
            that.setData({
              shopinfo: res.data,
              noneSeller: false
            })
            app.globalData.majorid = res.data.majorid;

          } else {

            that.setData({
              noneSeller: true
            })
            fifter.toast(res.data.msg)
          }

        }
      },
      fail: function (res) {
        // console.log('getShopInfo---fail')
        // console.log(res)
      },
      complete: function (res) {},
    })
  },
  // 获取用户信息
  getSystemInfo() {
    let that = this;
    try {
      var res = wx.getSystemInfoSync()
      if (res.SDKVersion < "1.2.0") {
        fifter.tips("", "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。")
        that.setData({
          noneSeller: true
        })
      } else {
        that.setData({
          noneSeller: false
        })
        wx.showLoading({
          title: '正在搜索设备',
          mask: true,
          success: function (res) {},
          fail: function (res) {},
          complete: function (res) {},
        })

        // 搜索设备
        that.getIbeacon()


      }
    } catch (e) {
      // Do something when catch error
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    wx.openBluetoothAdapter({
      success: function (res) {
        // 获取用户设备信息
        that.getSystemInfo()
      },
      fail: function (res) {
        fifter.tips("", "请打开蓝牙")
        that.setData({
          noneSeller: true
        })
      },
      complete: function (res) {},
    })
    
    this.data.timer = setInterval(function(){
      console.log(that.data.minmajor);
      if (app.globalData.openid != null && that.data.minmajor != '' && that.data.minorid!=''&&that.data.shopinfo.name != null){
        console.log('upload');
        that.getAnyMinor(that.data.minmajor, that.data.minorid);
      }
    }, 3 * 1000);

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
    let that = this;
    // wx.openBluetoothAdapter({
    //   success: function (res) {
    //     // 获取用户设备信息
    //     that.getSystemInfo()
    //   },
    //   fail: function (res) {
        // console.log(res)
    //     fifter.tips("", "请打开蓝牙")
    //     that.setData({
    //       noneSeller: true
    //     })
    //   },
    //   complete: function (res) {

    //   },
    // })

    wx.removeStorage({
      key: 'couponId',
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
    // 返回首页重新载入优惠券
    if (app.globalData.openid != null && that.data.minmajor!=null) {
      that.getCouponRequest(5, 1, "expire", that.data.minmajor, 0)
      that.getCouponRequest(5, 1, "used", that.data.minmajor, 0)
      that.getCouponRequest(5, 1, "unuse", that.data.minmajor, 1)
      
    }
    // 返回首页关闭优惠券详情,且未使用按钮高亮
    that.setData({
      main_show: true,
    })
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