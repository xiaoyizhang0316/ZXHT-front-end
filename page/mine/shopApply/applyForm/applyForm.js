// page/mine/shopApply/applyForm/applyForm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop:{
      name: '',
      sign: '',
      payment: 'RMB',//默认支付方式为人民币
      bankName: '',
      accountNbr: '',
      accountName:''
    },
    payItems:[
      { name: '人民币', value: 'RMB', checked: 'true'},
      { name: 'Australian Dollar', value: 'AusDollar' },
    ],
    tips:{
      zh_cn :'请填写对应的支付信息',
      en : 'Please fill in the payment information.'
    }

  },

  radioChange: function (e) {
    this.setData({
      'shop.payment': e.detail.value,
      'shop.bankName': '',
      'shop.accountNbr' : '',
      'shop.accountName' : ''
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
          'shop.sign':'我们只是澳洲正品的搬运工~'
        })
      }
    }),

    this.setData({
      payment: 'RMB',
    })
  },

  formSubmit: function(e) {
    wx.redirectTo({
      url: '/page/mine/shopApply/applySuccess/applySuccess'
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