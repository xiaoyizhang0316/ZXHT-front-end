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
	},
	onLoad() {
		var self = this;
		//如果未授权则不允许进入本页面
		if (app.globalData.nickName == null) {
			wx.showModal({
				title: '未登录',
				content: '您未授权登录本系统，请在下个页面允许真享海淘访问您的信息，否则无法开店。如果不允许, 如需开店请退出小程序，删掉小程序后，搜索本程序重新加载才能开店。',
				success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定')
						wx.openSetting({
							success: function (data) {
								console.log(data)
								if (data) {
									if (data.authSetting["scope.userInfo"] == true) {

										wx.getUserInfo({
											withCredentials: false,
											success: function (res) {
												//处理获得的用户信息

												console.info(res.userInfo);
												app.globalData.nickName = res.userInfo.nickName
												app.globalData.avatarUrl = res.userInfo.avatarUrl
												wx.setStorage({
													key: 'nickname',
													data: app.globalData.nickName
												})
												wx.setStorage({
													key: 'avatarUrl',
													data: app.globalData.avatarUrl
												})
												self.saveOrUserData(res.userInfo)

											},
											fail: function () {
												app.globalData.nickName = "未登录用户"

											}
										});

									}
								}
							}
						})
					} else if (res.cancel) {
						console.log('用户点击取消')
						wx.navigateBack({
							delta: -1
						})
					}
				}
			})

		}



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
		console.log(app.globalData)
		if (app.globalData.nickName == "未登录用户" || app.globalData.nickName == null)
		{	
			wx.showToast({
				title: '未登录不能开店',
				icon: 'loading',
				duration: 2000
			})
		}else{
			wx.navigateTo({
				url: '/page/mine/shopApply/shopApply'
			})
		}
		
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

	//用户登录后把用户储存在user表里, 把用户是否注册状态存入缓存
	saveOrUserData: function (userInfo) {
		var self = this

		//let url = "https://a5f93900.ngrok.io/api/mall/users/saveOrUpdateUserData"
		let url = COM.load('CON').CREATE_OR_UPDATE_USER;
		COM.load('NetUtil').netUtil(url, "POST", { "open_id": app.globalData.openId, "name": userInfo.nickName, "avatarUrl": userInfo.avatarUrl, "country": userInfo.country, "province": userInfo.province, "city": userInfo.city }, (callback) => {

			wx.setStorage({
				key: 'userId',
				data: callback,
			})
		})
		self.onShow()
	},

})