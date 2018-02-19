// page/mine/shopApply/applyForm/applyForm.js
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
      accountName: ''
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
  bindName: function (e) {
    this.setData({
      'shop.name': e.detail.value
    })
  },
  bindSign: function (e) {
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
    self = this
    wx.getUserInfo({
      success: function (res) {
        self.setData({
          'shop.name': res.userInfo.nickName + '的澳洲直邮店',
          'shop.sign': '我们只是澳洲正品的搬运工~'
        })
      }
    }),
      this.setData({
        payment: 'RMB',
      })
  },

  formSubmit: function (e) {
    console.log("pushed")
    self = this
    //let url = "https://a5f93900.ngrok.io/api/mall/shops/create"
    //let url = "https://mini.zhenxianghaitao.com/api/mall/shops/create"
    let url = COM.load('CON').CREATE_SHOP;
    if (self.data.shop.name == null || self.data.shop.name == '') {
      wx.showModal({
        title: '开店失败',
        content: '店铺名不能为空'
      })
    }
    else if (self.data.shop.sign == null || self.data.shop.sign == '') {
      wx.showModal({
        title: '开店失败',
        content: '店铺签名不能为空'
      })
    }
    else if (self.data.shop.bankName == null || self.data.shop.bankName == '') {
      wx.showModal({
        title: '开店失败',
        content: '开户行不能为空'
      })
    }
    else if (self.data.shop.accountNbr == null || self.data.shop.accountNbr == '') {
      wx.showModal({
        title: '开店失败',
        content: '户名不能为空'
      })
    }
    else if (self.data.shop.accountName == null || self.data.shop.accountName == '') {
      wx.showModal({
        title: '开店失败',
        content: '账户不能为空'
      })
    } else {
      COM.load('NetUtil').netUtil(url, "POST", {
        "open_id": app.globalData.openId,
        "owner": app.globalData.nickName,
        "shopName": self.data.shop.name,
        "sign": self.data.shop.sign,
        "payment": self.data.shop.payment,
        "bankName": self.data.shop.bankName,
        "accountNbr": self.data.shop.accountNbr,
        "accountName": self.data.shop.accountName
      }, (callbackdata) => {
        if (callbackdata == true) {
          console.log("成功")
          app.globalData.shopId = app.globalData.openId
          wx.showModal({
            title: '开店成功',
            content: '您的店铺已开启',
          })
          wx.redirectTo({
            url: '/page/mine/shopApply/applySuccess/applySuccess'
          })
          app.globalData.shopOpened = true
          wx.setStorage({
            key: 'shopOpened',
            data: true
          })

        }
        else {
          console.log("失败")
          wx.showModal({
            title: '开店失败',
            content: '请检查你填写的信息'
          })
        }
      })
    }
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