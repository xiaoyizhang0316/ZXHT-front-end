var app = getApp()
var COM = require('../../../utils/common.js')

Page({

  data: {
    shopName: null,
    shopSign: null,
    WXaddress: null,
    paymentMethod: null,
    thumb: null,
    nickName: null,
    accountDetail:
    {
      //开户行
      bankName: null,
      //户名
      accountNbr: null,
      //账户
      accountName: null
    }
  },

  onLoad() {
    var self = this;
    self.setData({
      thumb: wx.getStorageSync("avatarUrl"),
      nickName: wx.getStorageSync("nickname")
    })
    let url = "https://a5f93900.ngrok.io/api/mall/shops/openId/" + wx.getStorageSync("openId")
    console.log(url)
    COM.load('NetUtil').netUtil(url, "GET", "", (myShopInfo) => {
      console.log(myShopInfo)
     })
     console.log("nihao")
  },
  

  confirmChange(event) {

  }
})