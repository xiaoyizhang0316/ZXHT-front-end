// page/mine/shopSwitch/shopSwitch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [
      { shop_id: 1, shop_name: '店铺名称1', shop_sign: '本店品种繁多，物美价廉，欢迎选购！', shop_logo: '/image/cart1.png' },
      { shop_id: 2, shop_name: '店铺名称2', shop_sign: '本店品种繁多，物美价廉，欢迎选购！', shop_logo: '/image/cart2.png' },
      { shop_id: 3, shop_name: '店铺名称3', shop_sign: '本店品种繁多，物美价廉，欢迎选购！', shop_logo: '/image/cart1.png' },
      { shop_id: 4, shop_name: '店铺名称4', shop_sign: '本店品种繁多，物美价廉，欢迎选购！', shop_logo: '/image/cart1.png' },
      { shop_id: 5, shop_name: '店铺名称5', shop_sign: '本店品种繁多，物美价廉，欢迎选购！', shop_logo: '/image/cart1.png' },
      { shop_id: 6, shop_name: '店铺名称6', shop_sign: '本店品种繁多，物美价廉，欢迎选购！', shop_logo: '/image/cart1.png' },
      { shop_id: 7, shop_name: '店铺名称7', shop_sign: '本店品种繁多，物美价廉，欢迎选购！', shop_logo: '/image/cart1.png' },
      { shop_id: 8, shop_name: '店铺名称8', shop_sign: '本店品种繁多，物美价廉，欢迎选购！', shop_logo: '/image/cart1.png' },
      { shop_id: 9, shop_name: '店铺名称9', shop_sign: '本店品种繁多，物美价廉，欢迎选购！', shop_logo: '/image/cart1.png' },
    ],
    idolList: [
      { idol_id: 1, idol_name: '大哥' },
      { idol_id: 2, idol_name: '二哥' }
    ],
    selectedShop: {},
    isSelect: false,

    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
  },


  radioChange: function (e) {
    this.setData({
      selectedShop: this.data.shopList[e.detail.value],
      isSelect: true
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    /** 
    * 获取系统信息 
    */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
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