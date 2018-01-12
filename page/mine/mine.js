// page/component/new-pages/user/user.js
var app = getApp()
var COM = require('../../utils/common.js')

Page({
  data: {
    thumb: '',
    nickname: '',
    orders: [],
    hasAddress: false,
    address: {},
    touched: [],
    openShopButton: false,
  },
  onLoad() {
    var self = this;
    /**
     * 获取用户信息
     */
    self.setData({
      thumb: app.globalData.avatarUrl,
      nickname: app.globalData.nickName
    })
    console.log(self.data.thumb)

    //如果没开过店则显示按钮
    if (app.globalData.shopOpened == false) {
      self.setData({
        openShopButton: true
      })
    }
    /**
     *发起请求获取订单列表信息
    */
    wx.request({
      url: 'http://www.gdfengshuo.com/api/wx/orders.txt',
      success(res) {
        self.setData({
          orders: res.data
        })
      }
    })
  },
  onShow() {
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
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

  order: function (event) {
    wx.navigateTo({
      url: '/page/mine/order/orderHistory'
    })
  },

  consignee: function (event) {
    wx.navigateTo({
      url: '/page/mine/addressList/addressList'
    })
  },

  switchShop: function (event) {
    wx.navigateTo({
      url: '/page/mine/shopSwitch/shopSwitch'
    })
  },

  openShop: function (event) {
    wx.navigateTo({
      url: '/page/mine/shopApply/shopApply'
    })
  },

  product: function (event) {
    wx.navigateTo({
      url: '/page/mine/shop/product/sell'
    })
  },

  aboutus: function (event) {
    wx.navigateTo({
      url: '/page/mine/about/us'
    })
  },



})