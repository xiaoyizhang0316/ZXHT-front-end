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
    touched: [],
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
    //let url = "https://a5f93900.ngrok.io/api/mall/shops/openId/" + wx.getStorageSync("openId")
		let url = COM.load("CON").getMyShopInfo + wx.getStorageSync("openId")
    //console.log(url)
    
    COM.load('NetUtil').netUtil(url, "GET", "", (myShopInfo) => {
     self.setData({
       shopName: myShopInfo.shopName,
       shopSign: myShopInfo.sign
     })
     
    })
  },


  touchstart: function (e) {
    var id = e.currentTarget.dataset.id;
    var array = this.data.touched;
    array[id] = true;
    this.setData({
      touched: array
    })
  },

  touchend: function (e) {
    var id = e.currentTarget.dataset.id;
    var array = this.data.touched;
    array[id] = false;
    this.setData({
      touched: array
    })
  },

  fans: function (event) {
    wx.navigateTo({
      url: '/page/mine/fans/fans'
    })
  },

  product: function (event) {
    wx.navigateTo({
      url: '/page/mine/shop/product/sell'
    })

  },

  accountDetail: function(event){
    wx.navigateTo({
      url: '/page/mine/myShop/accountDetail/accountDetail',
    })
  },

  confirmChange(event) {

  }
})