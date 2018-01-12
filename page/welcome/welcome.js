var app = getApp();
// var Util = require('../../utils/util.js')
// var CON = require('../../utils/constant.js')

var COM = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    COM.load('Util').loadBrands();
    COM.load('Util').loadProducts();
    let products = wx.getStorageSync("products");
    let brands = wx.getStorageSync("brands");
    // if (brands && products) {
    //   wx.switchTab({
    //     url: '../index/index',
    //   })
    // } else {
      var interval = setInterval(function () {
        console.info('checking the storage');
        let products = wx.getStorageSync("products");
        let brands = wx.getStorageSync("brands");
        if (brands && products) {
          clearInterval(interval);
          wx.switchTab({
            url: '../index/index',
          })
        }
      }, 2500);
   // }


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