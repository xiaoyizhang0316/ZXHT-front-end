var app = getApp();

var COM = require('../../utils/common.js')

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		targetShopId: "",
		showModal: false,
		count:0,
		approve:false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		COM.load('Util').loadBrands();
		COM.load('Util').loadShipAgents();
		COM.load('Util').loadPayments();
		COM.load('Util').loadShopParams();
		let self = this
		if (Object.prototype.toString.call(options) !== '[object Undefined]' && Object.prototype.toString.call(options.targetShopId) !== '[object Undefined]') {
			console.log(options.targetShopId)
		} else {
			//this.navigatorToIndex()
			let targetShopId = wx.getStorageSync("targetShopId")
			if (targetShopId && targetShopId != "oVxpo5FQkb2qY4TGpD9rq2xFWRlk") {
				options.targetShopId = targetShopId
			} else {
				options.targetShopId = "oVxpo5FQkb2qY4TGpD9rq2xFWRlk"
			}

		}
		app.globalData.targetShopId = options.targetShopId
		this.prepare(options)
	},

	prepare: function (e) {
		let self = this
		if ((app.globalData.openId != null && app.globalData.openId != "") && (app.globalData.userId != false || self.data.count > 5 )) {
			//如果点了允许 但是数据还没有取到 也要等待
			self.hideModal();
			if (self.data.approve == true && app.globalData.userId == false)
			{ 
				setTimeout(function () {
					self.prepare(e)					
				}, 1000)
				return
			}
			self.setTargetShop(e)
			//从读取所有的商品修改为读取本店的商品
			COM.load('Util').loadProducts(app.globalData.openId, app.globalData.targetShopId);
		} else {
			if (app.globalData.openId != null && (app.globalData.userId == false && self.data.approve == false))
			{
				self.setData({ showModal: true })
			}
			setTimeout(function () {
				
				self.prepare(e)
				let c = self.data.count + 1
				self.setData({ count: c })

			}, 1000)
			return
		}
	},

	//用户登录后把用户储存在user表里, 把用户是否注册状态存入缓存
	saveOrUserData: function (userInfo) {
		var self = this
		let url = COM.load('CON').CREATE_OR_UPDATE_USER;
		COM.load('NetUtil').netUtil(url, "POST", { "open_id": app.globalData.openId, "name": userInfo.nickName, "avatarUrl": userInfo.avatarUrl, "country": userInfo.country, "province": userInfo.province, "city": userInfo.city }, (callback) => {
			app.globalData.userId = callback;
			wx.setStorage({
				key: 'userId',
				data: callback,
			})
		})
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
	onConfirm: function (e) {
		let self = this
		
		//储存用户信息
		console.log("********************")
		app.globalData.nickName = e.detail.userInfo.nickName
		app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
		wx.setStorage({
			key: 'nickname',
			data: app.globalData.nickName
		})
		wx.setStorage({
			key: 'avatarUrl',
			data: app.globalData.avatarUrl
		})
		
		self.saveOrUserData(e.detail.userInfo)
	},
	//如果点了确定
	onBindTap(e)
	{
		let self = this
		self.setData({ approve: true })
		this.hideModal();
	},
	//获得访问的商店
	setTargetShop: function (e) {
		//	let self = this
		//得到传输过来的目标商铺
		console.log(app.globalData.openId)
		let fan = app.globalData.openId
		let shop = e.targetShopId
		
		let url = COM.load('CON').APPLY_TO_SHOP;
		COM.load('NetUtil').netUtil(url, "POST", { "open_id": fan, "shop_id": shop }, (callback) => {
			console.log("applytoshop callback")
			console.log(callback)
			if (callback.flag == false) { 
				wx.showModal({
					title: '提示',
					content: '已经为您向店主申请进入本店铺, 请等待店主审核, 点击确认进入展厅',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定')
							wx.navigateTo({
								url: '/page/welcome/welcome?targetShopId=oVxpo5FQkb2qY4TGpD9rq2xFWRlk',
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
				app.globalData.deposit = callback.deposit
				console.log("deposit: " + app.globalData.deposit)
				app.globalData.targetShopId = e.targetShopId
				this.navigatorToIndex();

			}
		})
	},
	navigatorToIndex: function () {
		var interval = setInterval(function () {
			console.info('checking the storage');
			let products = wx.getStorageSync("shopProducts");
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

	testFun: function () {
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
	onGotUserInfo: function (e) {
		console.log(e.detail.errMsg)
		console.log(e.detail.userInfo)
		console.log(e.detail.rawData)
	},
})