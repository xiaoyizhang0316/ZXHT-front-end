// page/mine/shopApply/applyForm/applyForm.js
var app = getApp()
var COM = require('../../../../utils/common.js')
import WxValidate from "../../../../utils/Validate/WxValidate.js"
var Validate = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop: {
      shopname: '',
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
    console.log(e)
    this.setData({
      'shop.shopname': e.detail.value
    })
    console.log(this.data.shop.shopname)
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
          'shop.shopname': res.userInfo.nickName + '的澳洲直邮店',
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
    let self = this
    //let url = "https://a5f93900.ngrok.io/api/mall/shops/create"
    //let url = "https://mini.zhenxianghaitao.com/api/mall/shops/create"
    let url = COM.load('CON').CREATE_SHOP;
    // if (self.data.shop.name == null || self.data.shop.name == '') {
    //   wx.showModal({
    //     title: '开店失败',
    //     content: '店铺名不能为空'
    //   })
    // }



    // 验证字段的规则
    const rules = {
      shopname: {
        required: true
      },
      sign: {
        required: true
      },
      bankName: {
        required: true
      },
      accountNbr: {
        required: true,
        digit: true
      },
      accountName: {
        required: true
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      shopname: {
        required: '请输入店名'
      },
      sign: {
        required: '请输入店铺签名'
      },
      bankName: {
        required: '请输入开户行'
      },
      accountNbr: {
        required: '请输入户名',
        digit: '请输入正确的户名'
      },
      accountName: {
        required: '请输入账户'
      }
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      wx.showModal({
        title: '开店失败',
        content: error.msg
      })
    } else {
      COM.load('NetUtil').netUtil(url, "POST", {
        "open_id": app.globalData.openId,
        "owner": app.globalData.nickName,
        "shopName": self.data.shop.shopname,
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
  // onShareAppMessage: function () {

  // }
})