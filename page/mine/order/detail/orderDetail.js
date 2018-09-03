var app = getApp()
var COM = require('../../../../utils/common.js')
Page({

	data: {
		orderId: '',
		order: {},
		receiver: null,
		status: '已提交',
		orderTime: null,
		merchant: null,
		totalweight: null,
		totalPrice: null,
		totalQuantity: null,
		orderConfirmed: false,
		discount: null,
		postalFee: null,
		shipAgents: [],
		finalPayment: 0,
		shippingCost: 0,
		payment: null,
		shipFulls: [],
		shopId: null,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var order;
		if (options.order) {
			order = JSON.parse(options.order);
		} else {
			var orderId = options.orderId;
			let pages = getCurrentPages();
			var prevPage = pages[pages.length - 2]
			let orderList = prevPage.data.orderHistoryList
			order = orderList.filter(function (val) {
				if (val.orderInfo.id == orderId) {
					return val
				}
			});
		}
		var numofGoods = 0;
		for (var index = 0; index < order[0].orderGoods.length; index++) {

			numofGoods = numofGoods + order[0].orderGoods[index].num
		}
		if (order[0].orderInfo.orderStatus == 2) {
			this.setData({
				orderConfirmed: true
			})
		}
		console.log(numofGoods)
		let shipAgents = wx.getStorageSync("shipAgents")
		let payments = wx.getStorageSync("payments")
		this.setData({
			order: order[0],
			orderId: options.orderId,
			orderTime: order[0].orderInfo.addTime,
			merchant: order[0].sellerShop.shopName,
			shopId: order[0].orderInfo.shopId,
			// service: order.orderInfo.service,
			// sender: order[0].sender,
			// items: order[0].items,
			totalGoodsPrice: order[0].orderInfo.goodsCost,
			totalPrice: order[0].orderInfo.totalCost,
			totalQuantity: numofGoods,
			discount: order[0].orderInfo.discount,
			postalFee: order[0].orderInfo.shippingCost,
			// totalWeight: order[0].totalWeight,
			receiver: order[0].consignee,
			shipAgents: shipAgents,
			finalPayment: order[0].orderInfo.finalPayment,
			shippingCost: order[0].orderInfo.shippingCost,
			payment: order[0].orderInfo.payId - 1 < 0 ? "尚未选择" : payments[order[0].orderInfo.payId - 1].name,
			shipFulls: order[0].shipFulls
		});
		let s = JSON.stringify(this.data.order);
		console.log(JSON.parse(s));

		var that = this
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winWidth: res.windowWidth,
					winHeight: res.windowHeight
				});
			}
		});
	},

	cancelOrder: function (e) {
		var self = this;
		wx.showModal({
			content: '确定取消此订单?',
			showCancel: true,
			confirmText: '确认',
			success: function (res) {
				if (res.confirm) {
					try {
						let pages = getCurrentPages();
						var prevPage = pages[pages.length - 2]
						let orderList = prevPage.data.orderHistoryList
						let newList = orderList.filter(function (val) {
							return (val.orderId != e.currentTarget.dataset.order);
						});

						let url = COM.load('CON').CANCEL_ORDER_BUYER + e.currentTarget.dataset.order;
						COM.load('NetUtil').netUtil(url, "PUT", {}, (callback) => {
							console.log(callback)
						})

						wx.setStorage({
							key: "orderHistoryList",
							data: newList,
							success: function () {
								wx.navigateBack({
									delta: 1
								})
							}
						})
					} catch (e) {
						console.log(e);
					}
				}
			}
		})
	},

	// updateStauts: function(e) {
	//   wx.navigateTo({
	//     url: '/pages/detail/detail?order=' + this.data.orderId + '&status=' + event.currentTarget.dataset.status + '&customer=' + receiverName + '&delivered=' + delivered
	//   })
	// },

	copyOrderId: function (e) {
		let self = this;
		wx.setClipboardData({
			data: self.data.orderId,
			success: function (res) {
				wx.getClipboardData({
					success: function (res) {
						wx.showToast({
							title: '拷贝至剪贴板',
							icon: 'success',
							duration: 1200
						})
					}
				})
			}
		})
	},

	makeCall: function (e) {
		let number = e.currentTarget.dataset.mobile;
		COM.load('Util').makeCall(number);
	},

	placeOrder: function (e) {
		let self = this
		console.log(e)
		let orderId = e.currentTarget.dataset.order
		let url = COM.load('CON').REORDER_URL;
		COM.load('NetUtil').netUtil(url, "POST", { "orderId": orderId }, (callback) => {
			console.log(callback)
			if (callback.flag == true) {
				wx.showModal({
					title: '下单成功',
					content: '已经为您重新下单',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							wx.navigateBack({
								delta: 1
							})
						}
					}
				})
			} else {
				wx.showModal({
					title: '下单失败',
					content: '店家已下架此商品或者无货',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							wx.navigateBack({
								delta: 1
							})
						}
					}
				})
			}
		})

	},
	comment: function(e){
		let self = this
		let productId = self.data.order.orderGoods[e.currentTarget.dataset.id].productId
		let openId = app.globalData.openId
		let orderId = self.data.orderId
		let shopId = self.data.shopId
		let params = {
			
			"productId" : productId,
			"orderId" : orderId,
			"shopId" : shopId,
			"openId" : openId,
			
		}
		wx.navigateTo({
			url: '/page/common/templates/comment/comment?params=' + JSON.stringify(params)
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

	addToCart: function (e) {
		let self = this

		let product = self.data.order.orderGoods[e.currentTarget.dataset.id]
		console.log(product)
		var newCartItem = {}
		let order = self.data.order.orderInfo
		
		let url = COM.load('CON').GET_CURRENT_ORDERGOOD_PRICE +"/" +order.openId+ "/" + order.shopId+"/"+product.productId;
		COM.load('NetUtil').netUtil(url, "GET", {}, (callback) => {
			if (callback != 0) {
				product.price = callback;
			} else {
				wx.showModal({
					title: '下单失败',
					content: '店家已下架此商品或者无货',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							self.onShow()
						}
					}
				})
			}

		});

		newCartItem.title = product.title
		newCartItem.image = product.image
		newCartItem.num = product.num
		newCartItem.price = product.price
		newCartItem.id = product.productId
		// newCartItem.selected: true

		self.addCartItemToStorage(newCartItem)

	},
	addCartItemToStorage: function (item) {
		const self = this;
		//得到缓存的购物车
		let cartList = []
		cartList = wx.getStorageSync("cartList")
		if (cartList.length > 0) {
			console.log(cartList)
			var flag = false;
			for (var x in cartList) {
				if (cartList[x].id == item.id) {
					flag = true
					cartList[x].num += item.num
					break;
				}
			}
			if (!flag) {
				cartList.push(item)
			}
		} else {
			cartList = []
			cartList.push(item)
		}

		wx.setStorage({
			key: 'cartList',
			data: cartList,
			success: function (res) {
				wx.showToast({
					title: '添加购物车成功',
					icon: 'success',
					duration: 1500
				})
			}
		})

	},

	receiveOrder: function (e) {
		let self = this

		let orderId = e.currentTarget.dataset.order
		let url = COM.load('CON').RECEIVE_ORDER_URL + orderId;
		COM.load('NetUtil').netUtil(url, "PUT", {}, (callback) => {
			console.log(callback)
			if (callback == true) {
				wx.showModal({
					title: '收货成功',
					content: '谢谢您的支持',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							wx.navigateBack({
								delta: 1
							})
						}
					}
				})
			} else {
				wx.showModal({
					title: '收货失败',
					content: '请重新尝试一下~',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							wx.navigateBack({
								delta: 1
							})
						}
					}
				})
			}
		})
	},
	viewOrderExtraService: function (e) {
		console.log(e)
		let orderExtraServiceId = e.currentTarget.dataset.index
		//TODO
		wx.navigateTo({
			url: '/page/common/templates/editOrderExtraSerivce/editOrderExtraService?id=' + orderExtraServiceId+'&edit=0'
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	// onShareAppMessage: function () {
	//   return {
	//     title: this.data.orderId + ' 订单详情',
	//     path: '/pages/personal/order/detail/orderDetail?order=' + JSON.stringify(this.data.order) +"&shared=true"
	//   }
	// },
})