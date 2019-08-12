//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {

      //调用登录接口
      wx.login({
        success: function (res) {
          that.globalData.wxcode = res.code;

          wx.request({
            url: that.globalData.baseUrl + 'getOpenId',
            data: {
              js_code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            dataType: '',
            success: function (res) {
              if (res.errMsg === "request:ok") {
                that.globalData.openid = res.data.openid;
                that.globalData.sessionkey = res.data.session_key
                
                console.log('openid');
                console.log(res)
                wx.getUserInfo({
                  withCredentials: false,
                  lang:'zh_CN',
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                    console.log("userinfo用户信息")
                    console.log(res.userInfo)

                    wx.request({
                      url: that.globalData.baseUrl + 'updateUserinfo',
                      data: {
                        openid: that.globalData.openid,
                        nickname: res.userInfo.nickName,
                        gender: res.userInfo.gender,
                        province: res.userInfo.province,
                        city: res.userInfo.city
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      method: 'POST',
                      dataType: '',
                      success: function (res) {
                        console.log('修改用户信息')
                        console.log(res)

                      },

                    })
                  },
                  
                })
              }else{
                console.log('获取openid失败');
                console.log(res)
              }
            },
            fail: function (res) {},
            complete: function (res) {},
          })


        }
      })
     
    }
  },

  globalData: {
    userInfo: null, 
    baseUrl: "https://mio7.com.cn/Home/AppCoupon/",
    // appid: "wxb8af37054763ba8c",
    // appsecret: "b4f111e9e403428c30acaa5b5abcd792"
    // baseUrl: "http://n7nfbt.natappfree.cc/weixinsdk/coupon/Home/AppCoupon/",
     appid: "wx5fa866f767ecf4cd",
    appsecret: "c8eaa542df23d34f2617c8025f8d3f22"
  }
})