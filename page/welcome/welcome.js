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
		COM.load('Util').loadBrands();
		COM.load('Util').loadProducts();
		this.prepare(options)
  },

	prepare: function(e){
		let self = this	

		if (app.globalData.openId == null) {
			setTimeout(function () {
				self.prepare(e);

			}, 1000)
			return
		}
		if (Object.prototype.toString.call(e) !== '[object Undefined]' && Object.prototype.toString.call(e.targetShopId) !== '[object Undefined]') {
		this.setTargetShop(e)
		} else {
			//this.navigatorToIndex()
			e.targetShopId = "o0_gG0RDvF6ESSQSFZJKuOyB2bDE"
			this.setTargetShop(e)
		}		


	},

	//获得访问的商店
	setTargetShop: function (e) {
		let self = this
		//得到传输过来的目标商铺
		console.log(app.globalData.openId)
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
						content: '已经为您向店主申请进入本店铺, 请等待店主审核, 点击确认进入展厅',
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定')
								wx.navigateTo({
									url: '/page/welcome/welcome?targetShopId=o0_gG0RDvF6ESSQSFZJKuOyB2bDE',
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
								wx.navigateBack({
									delta: -1
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
					// success: function (e) {
					// 	var page = getCurrentPages().pop();
					// 	if (page == undefined || page == null) return;
					// 	page.onLoad();
					// } 
				})
			}
		}, 2000);

	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

	testFun: function(){
		console.log("OOOOOO");
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
  // onShareAppMessage: function () {

  // }
})