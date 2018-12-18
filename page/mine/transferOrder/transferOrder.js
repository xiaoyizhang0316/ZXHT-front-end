// page/mine/transferOrder/transferOrder.js
var app = getApp()
var COM = require('../../../utils/common.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		transferOrder: null,
		transferOrderGoods: null,
		totalCost: 0,
		shippingCost: 0,
		goodsCost: 0

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let self = this
		self.prepare(options)	
	},

	prepare: function(options)
	{
		console.log(options)
		if (Object.prototype.toString.call(options) !== '[object Undefined]' && Object.prototype.toString.call(options.orderId) !== '[object Undefined]') {
			let orderId = options.orderId
			if (app.globalData.openId == null) {
				setTimeout(function () {

					self.prepare(options)

				}, 1000)
				return
			} else {

				let orderId = options.orderId
				let url = COM.load('CON').GET_ORDERINFO + '/' + orderId;
				COM.load('NetUtil').netUtil(url, "GET", '', (orderInfo) => {
					if (orderInfo.orderInfo.shopId == app.globalData.openId) {
						wx.redirectTo({
							url: '/page/mine/getTransferOrder/getTransferOrder?orderId=' + orderId,
						})
					} else {
						let url = COM.load('CON').GET_TRANSFER_ORDER + '/' + app.globalData.openId + '/' + orderId;
						COM.load('NetUtil').netUtil(url, "GET", '', (transferOrderFull) => {
							console.log(transferOrderFull)
							if (Object.prototype.toString.call(transferOrderFull.orderStatus) !== '[object Undefined]' && transferOrderFull.orderStatus == 43 && Object.prototype.toString.call(transferOrderFull.transferOrder.transferShopId) !== '[object Undefined]' && transferOrderFull.transferOrder.transferShopId == app.globalData.openId) {
								wx.showModal({
									title: '可以发货了',
									content: '店主已经同意提价,请在下边的页面进行发货',
									showCancel: false,
									success: function (res) {
										if (res.confirm) {
											wx.redirectTo({
												url: '/page/mine/sell_order/sell_orderHistory',
											})
										}
									}
								})
							}
							// if (Object.prototype.toString.call(transferOrderFull.orderStatus) !== '[object Undefined]' && transferOrderFull.orderStatus == 43 && Object.prototype.toString.call(transferOrderFull.transferOrder.transferShopId) !== '[object Undefined]' && transferOrderFull.transferOrder.originalShopId == app.globalData.openId)
							// {
							// 	wx.showModal({
							// 		title: '可以发货了',
							// 		content: '店主已经同意提价,请在下边的页面进行发货',
							// 		showCancel: false,
							// 		success: function (res) {
							// 			if (res.confirm) {
							// 				wx.redirectTo({
							// 					url: '/page/mine/sell_order/sell_orderHistory',
							// 				})
							// 			}
							// 		}
							// 	})
							// }
							// console.log(transferOrderFull)
							let transferOrder = transferOrderFull.transferOrder
							let transferOrderGoods = transferOrderFull.transferOrderGoods
							this.setData({ transferOrder: transferOrder, transferOrderGoods: transferOrderGoods })
						})


					}
				})


			}

		} else {
			wx.showModal({
				title: '参数错误',
				content: '参数错误，请重新尝试',
				success: function (res) {
					if (res.confirm) {

						wx.navigateBack({
							delta: -1
						})
					} else if (res.cancel) {

						wx.navigateBack({
							delta: -1
						})
					}
				}
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

	updateGoodPrice: function (e) {
		if (e.detail.value == "") {
			e.detail.value = 0;
		}

		let self = this
		if (e.detail.value >= 0 && e.detail.value.toString().match(/^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/)) {
			let transferOrderGoods = self.data.transferOrderGoods
			let totalCost = 0
			
			transferOrderGoods.forEach(function (tg) {
				if (tg.productId == e.currentTarget.dataset.productid) {
					tg.price = e.detail.value
				}
				totalCost = (totalCost * 100 + tg.price * 100 * tg.num) / 100;
			});
			self.setData({goodsCost: totalCost})
			totalCost = (totalCost * 100 + self.data.shippingCost * 100) / 100
			self.setData({ totalCost: totalCost })
		} else {
			wx.showModal({
				title: '错误',
				content: '商品格式错误请检查后输入',
				showCancel: false,
				success: function (res) {
					let transferOrderGoods = self.data.transferOrderGoods
					
					transferOrderGoods.forEach(function (tg) {
						if (tg.productId == e.currentTarget.dataset.productid) {
							tg.price = 0
						}
						
					});
				}
			})
		}
	},
	updateShippingCost: function (e) {
		console.log(e)
		let self = this
		if(e.detail.value == "")
		{
			e.detail.value = 0;
		}

		if (e.detail.value >= 0 && e.detail.value.toString().match(/^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/)) {

			let totalCost = self.data.totalCost
			totalCost = (totalCost * 100 - self.data.shippingCost * 100) / 100
			self.setData({
				shippingCost: e.detail.value
			});
			totalCost = (totalCost * 100 + self.data.shippingCost * 100) / 100
			self.setData({ totalCost: totalCost })

		} else {
			wx.showModal({
				title: '错误',
				content: '邮费格式错误请检查后输入',
				showCancel: false,
				success: function (res) {
					
				}
			})
		}
	},
	applyTransferOrder: function (e) {
		console.log(e)
		let self = this
		let transferOrderId = e.currentTarget.dataset.order
		let transferOrderGoods = self.data.transferOrderGoods
		
		let goodsPrice = []
		transferOrderGoods.forEach(function(tg){
			goodsPrice.push({'transferOrderGoodId':tg.id, 'price':tg.price})
		})
		let params = {
			'transferOrderId': transferOrderId,
			'shippingCost': self.data.shippingCost,
			'goodsCost': self.data.goodsCost,
			'totalCost': self.data.totalCost,
			'goodsPrice':goodsPrice,
			'transferShopId': app.globalData.openId,
		}
		let url = COM.load('CON').APPLY_TRANSFER_ORDER;
		COM.load('NetUtil').netUtil(url, "POST", params, (res) => {
			if(res.flag==true)
			{
				wx.redirectTo({
					url: '/page/index/index',
				})
			}else{
				wx.showModal({
					title: '错误',
					content: res.errorMessage,
				})
			}
		})

	}

	/**
	 * 用户点击右上角分享
	 */
	//   onShareAppMessage: function () {

	//   }
})