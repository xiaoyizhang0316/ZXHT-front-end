// page/mine/fans/fans.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fans: [
      { fan_id: 1, fan_name: 'name1', fan_avatar:'/image/avatar.png'},
      { fan_id: 2, fan_name: 'name2', fan_avatar: '/image/avatar.png' },
      { fan_id: 3, fan_name: 'name3', fan_avatar: '/image/avatar.png' },
      { fan_id: 4, fan_name: 'name4', fan_avatar: '/image/avatar.png' },
      { fan_id: 5, fan_name: 'name5', fan_avatar: '/image/avatar.png' },
      { fan_id: 6, fan_name: 'name6', fan_avatar: '/image/avatar.png' },
      { fan_id: 7, fan_name: 'name7', fan_avatar: '/image/avatar.png' },
      { fan_id: 8, fan_name: 'name8', fan_avatar: '/image/avatar.png' },
      { fan_id: 9, fan_name: 'name9', fan_avatar: '/image/avatar.png' },
      
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

  share: function (event) {
    wx.navigateTo({
      url: '/page/mine/fans/share/share'
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