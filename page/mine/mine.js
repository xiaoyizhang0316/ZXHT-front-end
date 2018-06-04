// page/component/new-pages/user/user.js
var app = getApp()
var COM = require('../../utils/common.js')

Page({
	data: {
		thumb: '',
		nickname: '',
		orders: [],
		hasAddress: false,
		address: {},
		touched: [],
		openShopButton: false,
		showModal:false,
	},
	onLoad() {
		



	},
	onShow() {
		var self = this;
		


		/**
     * 获取用户信息
     */
		self.setData({
			thumb: app.globalData.avatarUrl,
			nickname: app.globalData.nickName ? app.globalData.nickName : "未登陆用户"
		})


		//如果没开过店则显示按钮
		if (app.globalData.shopOpened == false) {
			self.setData({
				openShopButton: true
			})
		}

    /**
     * 获取本地缓存 地址信息
     */

		wx.getStorage({
			key: 'address',
			success: function (res) {
				self.setData({
					hasAddress: true,
					address: res.data
				})
			}
		})
		if (app.globalData.shopOpened == true) (
			self.setData({
				openShopButton: false
			})
		)
	},


	touchstart: function (e) {
		var id = e.currentTarget.dataset.id;
		var array = this.data.touched;
		array[id] = true;
		this.setData({
			touched: array
		})
	},

	touchend: function (e) {
		var id = e.currentTarget.dataset.id;
		var array = this.data.touched;
		array[id] = false;
		this.setData({
			touched: array
		})
	},

	order: function (event) {
		wx.navigateTo({
			url: '/page/mine/order/orderHistory'
		})
	},

	consignee: function (event) {
		wx.navigateTo({
			url: '/page/mine/addressList/addressList'
		})
	},

	switchShop: function (event) {
		wx.navigateTo({
			url: '/page/mine/shopSwitch/shopSwitch'
		})
	},

	openShop: function (event) {
		var self = this;
		//如果未授权则不允许进入本页面
		console.log(app.globalData)
		if (app.globalData.nickName == "未登录用户" || app.globalData.nickName == null) {
			self.setData({showModal : true})
			

		} else {
			wx.navigateTo({
				url: '/page/mine/shopApply/shopApply'
			})
		}
		
		
	},
	onCancel: function () {
		this.hideModal();
		wx.showToast({
			title: '未登录不能开店',
			icon: 'loading',
			duration: 2000
		})
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
	//用户登录后把用户储存在user表里, 把用户是否注册状态存入缓存
	saveOrUserData: function (userInfo) {

		var self = this
		let url = COM.load('CON').CREATE_OR_UPDATE_USER;
		COM.load('NetUtil').netUtil(url, "POST", { "open_id": app.globalData.openId, "name": userInfo.nickName, "avatarUrl": userInfo.avatarUrl, "country": userInfo.country, "province": userInfo.province, "city": userInfo.city }, (callback) => {
			app.globalData.userId = callback;
			wx.setStorage({
				key: 'userId',
				data: callback,
				success: function(res)
				{
					wx.navigateTo({
						url: '/page/mine/shopApply/shopApply'
					})
				}
			})
		})
	},
	//如果点了确定
	onBindTap(e) {
		let self = this	
		this.hideModal();
	},

	product: function (event) {
		wx.navigateTo({
			url: '/page/mine/shop/product/sell'
		})
	},

	aboutus: function (event) {
		wx.navigateTo({
			url: '/page/mine/about/us'
		})
	},

	fans: function (event) {
		wx.navigateTo({
			url: '/page/mine/fans/fans'
		})
	},

	myShop: function (event) {
		wx.navigateTo({
			url: '/page/mine/myShop/myShop'
		})
	},

	pendingPay: function (event) {
		wx.navigateTo({
			url: '/page/mine/order_pay/orderHistory_pay'
		})
	},

	order_receive: function (event) {
		wx.navigateTo({
			url: '/page/mine/order_receive/orderHistory_receive'
		})
	},
	
	helpCenter:function(event)
	{
		wx.navigateTo({
			url: '/page/mine/helpCenter/helpCenter'
		})
	},

	hideModal: function () {
		this.setData({
			showModal: false
		});


	},

})