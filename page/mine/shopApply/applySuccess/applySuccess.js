// page/mine/shopApply/applySuccess/applySuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onShareAppMessage: function () {
    return {
      title: '欢迎，这是xx的海淘店铺',
      desc: '分享的店铺编号是xxx',
      path: '/page/index/index?shopid=xxx'
    }
  },

  toShare: function (e) {
    console.log('to add goods')
    wx.redirectTo({
      url: '/page/mine/fans/share/share'
    })
  },

  toAddGoods: function (e) {
    console.log('to add goods')
    wx.redirectTo({
      url: '/page/mine/shop/product/sell'
    })
  },

  toIndex: function (e) {
    console.log('to index')
    wx.switchTab({
      url: '/page/index/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
})