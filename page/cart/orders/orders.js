var COM = require('../../../utils/common.js')
var app = getApp()
Page({
	data: {
		address: {},
		hasAddress: false,
		memo: '',
		total: 0,
		rmb: 0,
		orders: [],
		animationData: {},
		showModalStatus: false,
		showModal: false,
	},

	onReady() {

	},

	//如果为onShow那么会即时显示默认地址
	onLoad: function () {



	},

	onShow: function () {


		let self = this;
		console.log(self.data.address)
		if (Object.keys(self.data.address).length === 0) {
			let addressList = wx.getStorageSync('addressList')

			if (addressList.length >= 1) {

				var index = 0;//默认使用第一个
				for (let i = 0; i < addressList.length; i++) {
					if (addressList[i].isDefault == true) {
						index = i;
						break;
					}
				}
				self.setData({
					address: addressList[index],
					hasAddress: true
				})
				console.log(self.data.address)
			}

		}

		let orderInfo = wx.getStorageSync('orderInfo')

		self.setData({
			orders: orderInfo.data,
		})


		self.getTotalPrice();
	},

	/**
	 * 计算总价
	 */
	getTotalPrice() {
		let orders = this.data.orders;
		let total = 0;
		let totalNum = 0;
		for (let i = 0; i < orders.length; i++) {
			total += orders[i].num * orders[i].price;
			totalNum += orders[i].num;
		}
		let shopParams = wx.getStorageSync("shopParams");

		this.setData({
			total: total.toFixed(2),
			rmb: (total * shopParams.rate).toFixed(2),
			totalNum: totalNum
		})
	},

	bindExtra: function () {
		wx.navigateTo({
			url: "/page/common/templates/textArea/textArea?content=" + this.data.memo + "&placeHolder=告诉卖家是否需要拍照签字等服务"
		})
	},

	placeOrder() {
		console.log(app.globalData)
		//let orderTime = COM.load('Util').formatTime(new Date());
		// if (app.globalData.targetShopId == null || app.globalData.targetShopId == app.globalData.openId || app.globalData.targetShopId == "oVxpo5FQkb2qY4TGpD9rq2xFWRlk") {
		let self = this
		if (app.globalData.targetShopId == null || app.globalData.targetShopId == app.globalData.openId) {
			wx.showModal({
				title: '错误',
				content: '您不能在自己的店或者展览厅中购物',
				success: function (res) {
					if (res.confirm) {
						return
					} else if (res.cancel) {
						return
					}
				}
			})
			return
		} else if (app.globalData.nickName == "未登录用户" || app.globalData.nickName == null) {
			self.setData({ showModal: true })
			return
		}



		if (this.data.address.id == null) {
			wx.showModal({
				title: '错误',
				content: '您还没有选择收货人',
				success: function (res) {
					if (res.confirm) {
						return
					} else if (res.cancel) {
						return
					}
				}
			})
			return
		}

		let productinfo = wx.getStorageSync("orderInfo")
		var index = 0

		for (index = 0; index < productinfo.data.length; index++) {
			productinfo.data[index].productId = productinfo.data[index].id
			delete (productinfo.data[index].id)
		}
		console.log(productinfo)
		console.log(this.data.address)
		let order = {
			orderInfo: {
				openId: app.globalData.openId,
				shopId: app.globalData.targetShopId,
				consigneeId: this.data.address.id,
				goodsCost: this.data.total,
				orderMessage: this.data.memo
			},
			orderGoods: productinfo.data
		};
		let url = COM.load('CON').SAVE_ORDER_URL;
		COM.load('NetUtil').netUtil(url, "POST", order, (callback) => {
			wx.showModal({
				title: '提交订单成功',
				content: '订单已提交, 请等待店主确认邮费后进行支付',
				showCancel: false,
				success: function (res) {
					if (res.confirm) {
						wx.switchTab({
							url: '/page/index/index',
						})
					} else if (res.cancel) {
						wx.switchTab({
							url: '/page/index/index',
						})
					}
				}
			})
		})

		this.saveToOrderHistory(order);
		wx.removeStorageSync("cartList");



	},

	saveToOrderHistory: function (data) {
		let self = this;
		let orderHistoryList = wx.getStorageSync('orderHistoryList');
		if (!orderHistoryList) {
			orderHistoryList = [];
		};
		orderHistoryList.push(data);
		wx.setStorage({
			key: "orderHistoryList",
			data: orderHistoryList
		})
	},

	// 显示遮罩层
	showModal: function (e) {
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateY(300).step()
		this.setData({
			animationData: animation.export(),
			showModalStatus: true,
		})
		setTimeout(function () {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export()
			})
		}.bind(this), 200)
	},

	// 隐藏遮罩层
	hideModal: function () {
		this.setData({
			showModal: false
		});


	},
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
	//用户登录后把用户储存在user表里, 把用户是否注册状态存入缓存
	saveOrUserData: function (userInfo) {

		var self = this
		let url = COM.load('CON').CREATE_OR_UPDATE_USER;
		COM.load('NetUtil').netUtil(url, "POST", { "open_id": app.globalData.openId, "name": userInfo.nickName, "avatarUrl": userInfo.avatarUrl, "country": userInfo.country, "province": userInfo.province, "city": userInfo.city }, (callback) => {
			app.globalData.userId = callback;
			wx.setStorage({
				key: 'userId',
				data: callback,
				success: function (res) {
					self.placeOrder()
				}
			})
		})
	},
	//如果点了确定
	onBindTap(e) {
		let self = this
		this.hideModal();
	},
})