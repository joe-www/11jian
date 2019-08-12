// pages/pay/pay.js
var app = getApp()
var waitime = 60;
var fifter = require("../libs/fifter.js")
var Md5 = require("../libs/md5.js")
var allPrice, overPrice, lastprice;
var url = app.globalData.baseUrl;
var openID, sessionkey, formId;
let isNoWxPhone = false; // 手动短信
let couponID;   

Page({

  data: {
    telnumber: '', // 手机号
    codenumber: '', // 验证码
    ShowClear: false, // 清除初始
    iscode: true, // 验证码no禁用
    isGetWxNo: true, // 一键获取禁用
    isstar: true, // 付款禁用
    codedis: false, // 禁用验证码input
    loading: false, // loading
    codeText: "获取验证码",
    phone_show: false,
    choseCouponTitle: "未选择优惠券",
    payAllVal: "", // 总消费金额
    payChoseVal: "", // 不参与金额
    endprice: 0, //  实际价格
    iswitchShow: false, // 不参与优惠
    choseDisCoupon: true, // 禁用选择跳转
    couponID: "", // 优惠券id
    isTelShow: false, //  授权失败 显示手机控件
    isTelStepOneShow: false, // 一键授权 
    wxPhoneNumber: "", // 微信手机号,

  },
  // 价格计算
  getPrice(x) {
    let that = this;
    if (!overPrice) {
      overPrice = 0
    } else {
      overPrice = that.data.payChoseVal
    }
    if (x) {
      x = x
    } else {
      x = 0
    }
    lastprice = (Number(overPrice) + Number(allPrice - x)).toFixed(2);
    that.setData({
      endprice: lastprice
    })
  },
  // 不参与
  payChoseIpt(e) {
    overPrice = e.detail.value
    if (!allPrice) {
      fifter.toast("请先填写消费总额")
      this.setData({
        payChoseVal: ""
      })
      return;
    } else {
      this.setData({
        payChoseVal: overPrice
      })
      this.getPrice(this.data.reduce)
    }

  },
  // 消费总额
  payAllIpt(e) {
    let that = this;
    allPrice = e.detail.value;
    if (!allPrice) {
      that.setData({
        endprice: 0,
        isGetWxNo: true,
        choseDisCoupon: true
      })
    } else {
      that.setData({
        endprice: allPrice,
        payAllVal: allPrice,
        choseDisCoupon: false,
        isGetWxNo: false
      })
      if (allPrice < Number(that.data.full)) {
        wx.removeStorage({
          key: 'couponId',
          success: function (res) {
            that.setData({
              choseCouponTitle: "未选择优惠券",
              reduce: 0
            })
            that.getPrice(0)
          },
          fail: function (res) {},
          complete: function (res) {},
        })
      } else {
        that.getPrice(that.data.reduce)
      }

    }

  },
  // 获取推送码
  getFromId(fromid) {
    let that = this;
    wx.request({
      url: "https://mio7.com.cn/Home/App/getFromid",
      data: {
        openID: openID,
        fromID: fromid,

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        // console.log(res)
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  // 使用优惠券

  UseCoupon(id) {
    let that = this;
    wx.request({
      url: url + 'useCoupon',
      data: {
        couponID: id,
        openID: openID
      },
      header: {},
      method: 'GET',
      dataType: '',
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  // 获取手机号
  getPhoneNumber(e) {
    let that = this;
    wx.getNetworkType({
      success: function (res) {
        let networkdata = res.networkType;
        if (networkdata == 'none') {
          fifter.tips('', "当前无网络，请检查你的网络设置")
        } else {

          that.setData({
            isTelShow: false
          })

          if (e.detail.errMsg === "getPhoneNumber:fail user deny") {
            that.setData({
              isTelShow: true,
              isTelStepOneShow: false
            })
            isNoWxPhone = true
          } else if (e.detail.errMsg === "getPhoneNumber:ok") {
            isNoWxPhone = false
            wx.request({
              url: url + 'decryPt',
              data: {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                sessionKey: sessionkey,
                openID: openID
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              dataType: '',
              success: function (res) {
                console.log('decryPt')
                console.log(res)
                let data = res.data

                if (res.errMsg === "request:ok") {

                  if (typeof sessionkey === "undefined") {
                    fifter.toast("授权失败，请返回上页后重试")
                  } else {

                    that.setData({
                      wxPhoneNumber: data,
                      isTelShow: false, // 授权组件显示
                      isTelStepOneShow: true, // 禁用手动验证
                      isstar: false, // 付款打开
                      isGetWxNo: true //获取成功，禁用授权
                    })
                    // wx.hideLoading()  // 隐藏loading

                  }

                }
              },
              fail: function (res) {},
              complete: function (res) {},
            })

          }
        }
      }
    })
  },

  // 付款
  WxPay(phone) {
    let that = this;
    let majorid = app.globalData.majorid;
    let cid;
    if (!that.data.couponID) {
      cid = 0
    } else {
      cid = that.data.couponID
    }
    wx.request({
      url: url + 'payCoupon',
      data: {
        openID: openID,
        couponID: that.data.couponID,
        telphone: phone,
        price: that.data.endprice,
        majorID: majorid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        console.log('payCoupon')
        console.log(res)
        if (res.errMsg === "request:ok") {
          let data = res.data;
          let timestamp = (Date.parse(new Date()) / 1000).toString()
          let wxstr = {
            appId: data.appid,
            nonceStr: data.nonce_str,
            package: "prepay_id=" + data.prepay_id,
            signType: "MD5",
            timeStamp: timestamp,
            key: "2c827dd779f41f32eb5be61db96cd6dc"
          }
          let paySign = Md5.hexMD5("appId=" + wxstr.appId + "&nonceStr=" + wxstr.nonceStr + "&package=" + wxstr.package + "&signType=MD5&timeStamp=" + wxstr.timeStamp + "&key=" + wxstr.key)
          wx.requestPayment({
            'appId': data.appid,
            'timeStamp': timestamp,
            'nonceStr': data.nonce_str,
            'package': "prepay_id=" + data.prepay_id,
            'signType': 'MD5',
            'paySign': paySign,
            'success': function (res) {
              fifter.toast('付款成功', 'success')
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index'
                })
              }, 400)
            },
            'fail': function (res) {
              fifter.toast("取消支付")
            }
          })
        }
      },
      fail: function (res) {
        console.log('failpay');
        console.log(res);
      },
      complete: function (res) {},
    })
  },
  // 模板
  formSubmit(e) {
    let that = this;
    let formId = e.detail.formId;
    that.getFromId(formId)
  },
  // 选择器
  switchChange(e) {
    let that = this;
    if (e.detail.value == true) {
      that.setData({
        iswitchShow: true
      })
    } else {
      that.setData({
        iswitchShow: false,
        payChoseVal: ""
      })
      overPrice = ""
      that.getPrice(this.data.reduce)
    }
  },
  // 选择优惠券
  choseCoupon() {
    let that = this;
    setTimeout(function () {
      wx.navigateTo({
        url: '../coupon/coupon?payall=' + that.data.payAllVal + '&paychose=' + that.data.payChoseVal,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }, 100);
    
  },
  // 短信验证
  checkCode() {
    let that = this;
    wx.request({
      url: 'https://mio7.com.cn/Home/App/checkMsgcode',
      data: {
        phone: that.data.telnumber,
        code: that.data.codenumber
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        if (res.data.code === 0) {
          that.WxPay(that.data.telnumber);
        } else {
          fifter.toast(res.data.msg)
        }
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  // 短信发送
  sendPhone() {
    let that = this;
    wx.request({
      url: 'https://mio7.com.cn/Home/App/sendmsg',
      data: {
        phone: that.data.telnumber
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: '',
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  // 买单
  goBuy() {
    let that = this;
    const buy = (() => {
      if (isNoWxPhone == false) {
        that.WxPay(that.data.wxPhoneNumber)
      } else {
        that.checkCode()
      }
    })

    fifter.HaveNoneNetWork(buy())

  },
  // 关闭
  closeBtn() {
    this.setData({
      phone_show: false
    })
  },
  //  验证码button点击事件
  getcode() {
    var that = this;
    that.setData({
      codedis: false
    })
    wx.getNetworkType({
      success: function (res) {
        let networkdata = res.networkType;
        if (networkdata == 'none') {
          fifter.tips('', "当前无网络，请检查你的网络设置")
        } else {
          // 调用请求
          if (!that.CheckMobile()) {
            fifter.toast("手机号不正确")
            that.setData({
              iscode: true,
              codenumber: ""
            })
            return
          }
          that.getCodeTime()
          that.setData({
            codenumber: ""
          })
          that.sendPhone() //调用短信
        }
      },
      fail: function (res) {},
      complete: function (res) {},
    })

  },
  // 验证码倒计时
  getCodeTime() {
    var that = this;
    if (waitime === 0) {
      that.setData({
        iscode: false,
        codeText: "获取验证码"
      })
      waitime = 60

    } else {
      var ede = waitime + "秒后重试"
      that.setData({
        iscode: true,
        codeText: ede
      })
      waitime--;
      setTimeout(function () {
        that.getCodeTime()
      }, 1000);

    }
  },
  // 手机号码检测
  CheckMobile: function () {
    var that = this;
    var myregMobile = /^1[34578][0-9]{9}$/;

    if (!that.data.telnumber || !myregMobile.test(that.data.telnumber)) {
      that.setData({
        telnumber: '',
        codenumber: '',
        ShowClear: false, // 清除初始
        iscode: true, // 验证码禁用
        isstar: true, // 开始禁用
        // codedis: true, // 禁用验证码input
        loading: false, // loading
        codeText: "获取验证码",
      })
      fifter.toast('请输入正确的手机号')
      return false;
    } else {
      that.setData({
        iscode: false, // 验证码禁用
        isstar: true, // 开始禁用
        // codedis: true, // 禁用验证码input
        loading: false, // loading
        codeText: "获取验证码",
      })
      return true;
    }



  },
  // 验证码input聚焦事件
  codeinput(e) {
    // console.log(e)
    this.setData({
      codenumber: e.detail.value
    })
    if (e.detail.value.length == 6) {
      this.setData({
        isstar: false
      })
      wx.hideKeyboard()
    } else {
      this.setData({
        isstar: true
      })
    }
  },

  // 聚焦内容改变state
  telinput(e) {
    // console.log(e)
    if (e.detail.value) {
      this.setData({
        telnumber: e.detail.value,
        ShowClear: true,
        iscode: false
      })
      if (e.detail.value.length == 11) {
        wx.hideKeyboard()
      }
    } else {
      this.setData({
        ShowClear: false,
        iscode: true
      })
    }



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    openID = app.globalData.openid;
    sessionkey = app.globalData.sessionkey;

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
    wx.getStorage({
      key: 'couponId',
      success: function (res) {
        if (res.data) {
          that.setData({
            choseCouponTitle: `-¥${res.data.reduce}`,
            reduce: res.data.reduce,
            full: res.data.full,
            couponID: res.data.couponid

          })
          if (Number(res.data.full) <= Number(allPrice)) {
            that.getPrice(res.data.reduce)
          } else {

          }
          if (!allPrice) {
            that.setData({
              endprice: 0
            })
          }
        }
      },
      fail: function (res) {},
      complete: function (res) {},
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
    let that = this;
    wx.removeStorage({
      key: 'couponId',
      success: function (res) {
        that.setData({
          choseCouponTitle: "未选择优惠券",
          payAllVal: 0,
          payChoseVal: 0,
          endprice: 0
        })
        allPrice = 0;
        overPrice = 0;
      },
      fail: function (res) {},
      complete: function (res) {},
    })
    waitime = 0
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