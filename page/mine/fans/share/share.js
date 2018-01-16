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
    //let url = COM.load('CON').SHOP_PRODUCT_URL + "openId/" + 'david';
    // let url = COM.load('CON').PRODUCT_URL + "all";
    console.log(self);
    let url = "https://a5f93900.ngrok.io/api/mall/shops/getShopInfo/"+self.data.openId
  
    // NetUtil.netUtil(url, "GET", "", (shopProducts) => {
    COM.load('NetUtil').netUtil(url, "GET", "", (shopInfo) => {
      if (shopInfo) {
      console.log(shopInfo)
          // this.setData({
          //   goodsList: this.data.goodsList
          // })
       
      }
    });
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