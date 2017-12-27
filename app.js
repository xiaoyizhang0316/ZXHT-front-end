App({
  globalData: {
    hasLogin: false,
    shopOpenId: 'david'//wx.getStorageSync('shopId'),
  },
  onLaunch: function () {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log('App Launch at: ' + timestamp)
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }

})
