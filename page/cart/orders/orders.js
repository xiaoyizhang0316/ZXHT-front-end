var COM = require('../../../utils/common.js')
import drawQrcode from '../../../utils/weapp-qrcode.js'
var app = getApp()



Page({
	data: {
		address: {},
		hasAddress: false,
		memo: '',
		total: 0,
		
		orders: [],
		animationData: {},
		showModalStatus: false,
	
		selectedOrder: Object,
		payChoice: [

		],
		showPaymentModalStatus:false,
		showModal: false,
		index: 0,
		
		orderExtraServices:[],
		orderExtraServicesPrice:0,
		interval: ""

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
		// let shopParams = wx.getStorageSync("shopParams");
		total = total + this.data.orderExtraServicesPrice
		this.setData({
			total: total.toFixed(2),
			
			totalNum: totalNum
		})
	},

	bindExtra: function () {
		wx.navigateTo({
			url: "/page/common/templates/textArea/textArea?content=" + this.data.memo + "&placeHolder=给卖家留言"
		})
	},
	bindExtraServices: function (e) {
		wx.navigateTo({
			url: "/page/common/templates/extraServices/extraServices?shopId="+app.globalData.targetShopId
		})

	},

	placeOrder() {
		
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
				extraServicesCost: this.data.extraSerivcesPrice,
				orderMessage: this.data.memo
			},
			orderGoods: productinfo.data,
			orderExtraServices: this.data.orderExtraServices
		};
		let url = COM.load('CON').SAVE_ORDER_URL;
		COM.load('NetUtil').netUtil(url, "POST", order, (callback) => {
			console.log(callback)
			
			if(callback.flag == true)
			{
				if(callback.freePost == true)
				{
					//此店铺为包邮 所以直接调用支付功能					
					var animation = wx.createAnimation({
						duration: 200,
						timingFunction: "linear",
						delay: 0
					})
					self.animation = animation
					animation.translateY(300).step()					
					let shop = callback.orderFull.sellerShop
					let payChoice = []
					if (shop.offlinePay)
						payChoice.push({ id: 1, name: "线下支付" });
					if (shop.prepay) {
						let deposit = callback.orderFull.applyToShop.deposit
						payChoice.push({ id: 2, name: "预存款支付(当前预存款为￥" + deposit + ")人民币" });
					}
					if (shop.weixinPay)
						payChoice.push({ id: 3, name: "微信支付" });

					let selectedOrder = callback.orderFull;				
					// let rmb = selectedOrder.orderInfo.totalCost;
					// selectedOrder.orderInfo.rmb = rmb;
					self.setData({
						animationData: animation.export(),
						showPaymentModalStatus: true,
						selectedOrder: selectedOrder,
						payChoice: payChoice,
					})

					setTimeout(function () {
						animation.translateY(0).step()
						self.setData({
							animationData: animation.export()
						})
					}.bind(self), 200)
				}
				else{
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
				}

			}else{
				wx.showModal({
					title: '订单信息错误',
					content: callback.errorMessage,
				})
			}
			
		})

		//修改购物车 本单中的货物取消掉 
		
		let cartList = wx.getStorageSync('cartList')
		cartList = cartList.filter(item => !item.selected)
		
		wx.setStorage({
			key: "cartList",
			data: cartList
		})
		this.saveToOrderHistory(order);
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
	// 显示遮罩层	

	// 隐藏遮罩层
	hidePaymentModal: function () {
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateY(300).step()
		this.setData({
			animationData: animation.export(),
		})
		setTimeout(function () {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export(),
				showPaymentModalStatus: false
			})
			wx.switchTab({
				url: '/page/index/index',
			})
		}.bind(this), 200)
	},

	//确认支付
	payOrder: function (e) {
		var self = this;
		let order = self.data.selectedOrder;

		//1. offlinePay 2. prepay 3.weixinPay
		let payChoiceIndex = self.data.payChoice[self.data.index].id
		console.log
		if (payChoiceIndex == 2) {

			
			if (order.orderInfo.totalCost > order.applyToShop.deposit) {
				wx.showModal({
					title: '无法支付',
					content: '存款余额不足以支付本订单，请储值后购买',
				})

				return
			}
		}

		let url = COM.load('CON').PAY_ORDER_URL + e.currentTarget.dataset.order + "/" + app.globalData.openId + "/" + payChoiceIndex;
		console.log(url)
		COM.load('NetUtil').netUtil(url, "GET", {}, (callback) => {
			if (callback.flag == true) {
				if (callback.payChoice == 1 || callback.payChoice == 2) {
					wx.showModal({
						title: '提示',
						content: '支付成功',
						showCancel: false,
						success: function (res) {
							if (res.confirm) {
								wx.switchTab({
									url: '/page/index/index',
								})
							}
						}
					})
				} else if (callback.payChoice == 3) {
					if (callback.payment == 1) {
						let params = callback.params;
						wx.requestPayment({
							'timeStamp': params.timeStamp,
							'nonceStr': params.nonceStr,
							'package': params.package,
							'signType': params.signType,
							'paySign': params.paySign,
							'success': function (res) {
								wx.showModal({
									title: '提示',
									content: '支付成功',
									showCancel: false,
									success: function (res) {
										if (res.confirm) {
											wx.navigateBack({
												delta: 1
											})
										}
									}
								})
							},
							'fail': function (res) {
								wx.showModal({
									title: '提示',
									content: '支付失败',
									showCancel: false,
									success: function (res) {

									}
								})
							},
							'complete': function (res) {
								console.log("done");
							}
						})

					} else if (callback.payment == 2) {
						self.hideModal()
						self.setData({
							qrCodeImg: callback.qrCodeImg,
							qrCodeModal: true,
							qrCodeUrl: callback.qrCodeUrl
						})

						//显示图片后开始检查订单状态是否开始改变
						//TO DO 访问量可能cause其他问题 暂时不去解决
						var flag = 0
						var interval = setInterval(function () {
							flag++;

							console.log(flag)
							if (flag > 10) {
								clearInterval(interval)
								wx.showModal({
									title: '提示',
									content: '当前支付session结束，请点击确定进入订单管理重新支付',
									showCancel: false,
									success: function (e) {
										wx.redirectTo({
											url: '/page/mine/order/orderHistory',
										})
										return
									}
								})
							}
							let url = COM.load('CON').GET_ORDER_STATUS + e.currentTarget.dataset.order;
							COM.load('NetUtil').netUtil(url, "GET", {}, (callback) => {
								if (callback == 3) {
									wx.showModal({
										title: '提示',
										content: '支付成功',
										showCancel: false,
										success: function (e) {
											clearInterval(interval)
											wx.switchTab({
												url: '/page/index/index',
											})

										}
									})

								}
							},true,false)
						
						}, 5000)

						self.setData({
							interval : interval

						})						
					}
                }
			} else {
				wx.showModal({
					title: '支付失败',
					content: callback.message ? callback.message : "支付失败",
				})
			}

		})
	},
	bindPayChoiceChange: function (e) {

		this.setData({
			index: e.detail.value
		})
	},
	hideQrCodeModal: function (e) {
		this.setData({
			qrCodeModal: false
		});
	},
	downloadQrcode: function () {
		let self = this
		wx.showLoading({
			title: '加载中...',
		})
		if(self.data.interval != "")
		{
			clearInterval(self.data.interval)
		}
		self.onSaveImg();
	},
	onSaveImg: function () {
		// const ctx = wx.createCanvasContext('myCanvas'); //看回wxml里的canvas标签，这个的myCanvas要和标签里的canvas-id一致
		let self = this
		// ctx.clearRect(0, 0, 400, 400);
		// wx.downloadFile({
		// 	url: self.data.qrCodeImg,
		// 	success: function (e) {
		// 		console.log(e)
		// 	},fail:function(e)
		// 	{
		// 		console.log(e)
		// 	}
		// })
		// ctx.drawImage(self.data.qrCodeImg, 0, 0, 400, 400);
		// ctx.draw(true, 
		drawQrcode({
			width: 400,
			height: 400,
			canvasId: 'myCanvas',
			text: self.data.qrCodeUrl,
			callback: function (e) {
				console.log("--------------------------")
				console.log(e)
				setTimeout(function () { //为什么要延迟100毫秒？大家测试一下
					wx.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: 400,
						height: 400,
						destWidth: 400,
						destHeight: 400,
						canvasId: 'myCanvas',
						success: function (res) {
							self.data.savedImgUrl = res.tempFilePath;
							self.saveImageToPhoto();
						}
					})
				}, 100)
			}
		})
	},
	saveImageToPhoto: function () {
		let self = this
		if (this.data.savedImgUrl != "") {
			wx.saveImageToPhotosAlbum({
				filePath: this.data.savedImgUrl,
				success: function () {
					wx.showModal({
						title: '保存图片成功',
						content: '二维码已经保存到相册，您可以扫描后支付啦！',
						showCancel: false,
						success:function(e){
							wx.switchTab({
								url: '/page/index/index',
							})
						}
					});

				},
				fail: function (res) {
					console.log(res);
					if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") {
						wx.showModal({
							title: '保存图片失败',
							content: '您已取消保存图片到相册！',
							showCancel: false
						});
					} else {
						wx.showModal({
							title: '提示',
							content: '保存图片失败，您可以点击确定设置获取相册权限后再尝试保存！',
							complete: function (res) {
								console.log(res);
								if (res.confirm) {
									wx.openSetting({}) //打开小程序设置页面，可以设置权限
								} else {
									wx.showModal({
										title: '保存图片失败',
										content: '您已取消保存图片到相册！',
										showCancel: false
									});
								}
							}
						});
					}
				},
				complete: function (e) {
					wx.hideLoading();
					self.setData({
						qrCodeModal: false
					});
					self.setData({
						
						showPaymentModalStatus: false
					})
					
				},

			})
		}
	},

})