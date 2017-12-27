// page/mine/shopApply/shopApply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    codeBtnStatus: false,
    codeBtnText: '获取验证码',
    sendNeedSecond: 0
  },



  doApply: function (event) {
    wx.navigateTo({
      url: '/page/mine/shopApply/applyForm/applyForm',
    })
    // this.setData({
    //   showModal: true
    // })
  },

  sendCode: function (event) {
    this.setData({
      codeBtnStatus: true,
      sendNeedSecond: 60
    })
    self = this
    this.countdown(self)

  },

  countdown: function (that) {
    var second = that.data.sendNeedSecond
    if (second == 0) {
      // console.log("Time Out...");
      that.setData({
        codeBtnStatus: false
      });
      return;
    }
    var time = setTimeout(function () {
      that.setData({
        sendNeedSecond: second - 1
      });
      that.countdown(that);
    }
      , 1000)
  },
  /**
 * 弹出框蒙层截断touchmove事件
 */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
    wx.navigateTo({
      url: '/page/mine/shopApply/applySuccess/applySuccess'
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})