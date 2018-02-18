var app = getApp();

var COM = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
		targetShopId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		
		console.log(options)
		this.setTargetShop(options)	
    COM.load('Util').loadBrands();
    COM.load('Util').loadProducts();
    let products = wx.getStorageSync("products");
    let brands = wx.getStorageSync("brands");
    // if (brands && products) {
    //   wx.switchTab({
    //     url: '../index/index',
    //   })
    // } else {
		
		

		
   // }


  },


	//获得访问的商店
	setTargetShop: function (e) {
		//得到传输过来的目标商铺
		console.log("-----------------------------")
		console.log(e)
		if (Object.prototype.toString.call(e.targetShopId) !== '[object Undefined]') {
		console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbb")
			let fan = app.globalData.openId
			let shop = e.targetShopId
			//let url = "https://a5f93900.ngrok.io/api/mall/users/applyToShop/"

			let url = COM.load('CON').APPLY_TO_SHOP;
		
			COM.load('NetUtil').netUtil(url, "POST", { "open_id": fan, "shop_id": shop }, (callback) => {
			
				console.log(callback)
				console.log (callback == false)
				if (callback == false) {
				
					wx.showModal({
						title: '提示',
						content: '请等待目标商店管理员认证后进入商铺，点击取消退出小程序，点击确定进入总店 ',
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定')
								wx.navigateTo({
									url: '/page/welcome/welcome?targetShopId=o0_gG0RDvF6ESSQSFZJKuOyB2bDE',
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
								wx.navigateBack({
									delta: 2
								})
							}
						}
					})

					//to--do
				} else {
					//将得到的shopid 写入缓存并改写global shopid
					wx.setStorage({
						key: 'targetShopId',
						data: e.targetShopId,
					})
					app.globalData.targetShopId = e.targetShopId				
					this.navigatorToIndex();
				
				}
			})

		}else{
			this.navigatorToIndex()
		}
	},
	navigatorToIndex:function(){
		var interval = setInterval(function () {
			console.info('checking the storage');
			let products = wx.getStorageSync("products");
			let brands = wx.getStorageSync("brands");
			let openId = wx.getStorageSync("openId");
			if (brands && products && openId) {
				clearInterval(interval);
				wx.switchTab({
					url: '../index/index',
				})
			}
		}, 3000);

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