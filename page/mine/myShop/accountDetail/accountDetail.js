var app = getApp()
var COM = require('../../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop: {
      name: '',
      sign: '',
      payment: 'RMB',//默认支付方式为人民币
      bankName: '',
      accountNbr: '',
      accountName: '',
      shopId: ''
    },
    payItems: [
      { name: '人民币', value: 'RMB', checked: 'true' },
      { name: 'Australian Dollar', value: 'AusDollar' },
    ],
    tips: {
      zh_cn: '请填写对应的支付信息',
      en: 'Please fill in the payment information.'
    }

  },
  bindShopName: function (e) {
    this.setData({
      'shop.name': e.detail.value
    })
  },
  bindShopSign: function (e) {
    this.setData({
      'shop.sign': e.detail.value
    })
  },
  bindbankName: function (e) {
    this.setData({
      'shop.bankName': e.detail.value
    })
  },
  bindaccountNbr: function (e) {
    this.setData({
      'shop.accountNbr': e.detail.value
    })
  },
  bindaccountName: function (e) {
    this.setData({
      'shop.accountName': e.detail.value
    })
  },
  radioChange: function (e) {
    this.setData({
      'shop.payment': e.detail.value,
      'shop.bankName': '',
      'shop.accountNbr': '',
      'shop.accountName': ''
    })
    console.log(this.data.shop)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    //let url = "https://a5f93900.ngrok.io/api/mall/shops/openId/" + wx.getStorageSync("openId")
		let url = COM.load("CON").getMyShopInfo

    COM.load('NetUtil').netUtil(url, "GET", "", (myShopInfo) => {
      self.setData({
        'shop.name': myShopInfo.shopName,
        'shop.sign': myShopInfo.sign,
        'shop.payment': myShopInfo.payment,
        'shop.bankName': myShopInfo.bankName,
        'shop.accountNbr': myShopInfo.accountNbr,
        'shop.accountName': myShopInfo.accountName,
        'shop.shopId': wx.getStorageSync('shopId')
      })
      console.log(self.data.shop)

    })
  },

  formSubmit: function (e) {
    self = this
    let url = COM.load('CON').updateMyShopInfo
    // let url = COM.load('CON').shopisOpenOrNot;
    COM.load('NetUtil').netUtil(url, "PUT", {
      "open_id": app.globalData.openId,
      "owner": app.globalData.nickName,
      "shopName": self.data.shop.name,
      "sign": self.data.shop.sign,
      "payment": self.data.shop.payment,
      "bankName": self.data.shop.bankName,
      "accountNbr": self.data.shop.accountNbr,
      "accountName": self.data.shop.accountName,
      "id": self.data.shop.shopId
    }, (callbackdata) => {
      if (callbackdata == true) {
        // app.globalData.shopId = app.globalData.openId
        wx.showModal({
          title: '更新成功',
          content: '您的店铺信息已更新',
        })
        wx.redirectTo({
          url: '/page/mine/myShop/myShop'
        })

      }
      else {
        wx.showModal({
          title: '更新失败',
          content: '请检查你填写的信息'
        })
      }
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