var CON = require('constant.js');
/**
 * 网络请求的统一封装
 * params url地址 body网络请求中的body callback成功回调
 * 返回 格式res:{code:1/-1, errMsg, data} 1成功 -1失败
 * 包含统一的加载中 加载失败提示
 * **/
function netUtil(url, method,body, callBack) {
  wx.showLoading({
    title: '加载中',
    mask: false
  }) 
  var callBackData = {};

  //微信请求 
  wx.request({
    url: url,
    header: CON.HEADERS,
    method: method,
    data: body,
    success: function (res) {
      if (200 <= res.statusCode && res.statusCode <= 299) {
        callBackData.data = res.data;
        callBack(callBackData.data);
        wx.hideToast();
      } else if (res.statusCode === 404 || res.statusCode === 400){
        wx.showToast({
          title: "无法找到数据",
          duration: 1500,
          mask: true
        })
      } else if (500 <= res.statusCode && res.statusCode <= 599) {
        wx.showToast({
          title: "系统故障,请稍后再试",
          duration: 1500,
          mask: true
        })
        
      }
      setTimeout(function () {
       
        wx.hideLoading()
      }, 1500)
    },
    fail: function (res) {
      if (res.errMsg.includes("timeout")) {
        wx.showToast({
          title: "服务器忙,请稍后再试",
          duration: 3000,
          mask: true
        })
      } else {
      wx.showToast({
        title: "请检查网络",
        duration: 3000,
        mask: true
      })}
       setTimeout(function () {
         wx.hideToast()
       }, 1500)
    }
  });
}


module.exports = {
  netUtil: netUtil,
}



