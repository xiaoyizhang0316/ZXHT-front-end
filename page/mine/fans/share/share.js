// page/mine/share/share.js
var app = getApp()
var COM = require('../../../../utils/common.js')

Page({
  data: {
    thumb: '',
    nickname: '',
    openId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var self = this;
    /**
     * 获取用户信息
     */
    self.setData({
      thumb: app.globalData.avatarUrl,
      nickname: app.globalData.nickName,
      openId:app.globalData.openId,
    })
    console.log(self.data.thumb)
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '真享 海淘',
      path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})