
// 弹窗提示
const tips = function (title, content, showcancel, canceltext, cancelcolor, confirmtext, confirmcolor) {
    this.title = title || "提示";
    this.content = content;
    this.showCancel = showcancel || false;
    this.cancelText = canceltext || "取消",
    this.cancelColor = cancelcolor || "#010103",
    this.confirmText = confirmtext || "确认",
    this.confirmColor = confirmcolor || "#50c41b",
    wx.showModal({
      title: this.title,
      content: this.content,
      showCancel: this.showCancel,
      cancelText: this.cancelText,
      cancelColor: this.cancelColor,
      confirmText: this.confirmText,
      confirmColor: this.confirmColor,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
}
// toast提示
const toast = function(title,icon){
  wx.showToast({
    title: title,
    icon: icon || 'loading',
    image: '',
    duration: 1000,
    mask: true,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}



// 检测网络
const HaveNoneNetWork = ((fn)=>{
  wx.getNetworkType({
    success: function (res) {
      console.log(res)
      let networkdata = res.networkType;
      if (networkdata === 'none') {
        wx.showModal({
          title: '提示',
          content: '当前无网络，请检查你的网络设置',
          showCancel: false
        })
        
      }else{
        fn
      }
    }
  })
})



module.exports = {
  tips: tips,
  toast: toast,
  HaveNoneNetWork: HaveNoneNetWork
}


