var Util = require('../../../utils/util.js');
var app = getApp()
var COM = require('../../../utils/common.js')
import drawQrcode from '../../../utils/weapp-qrcode.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        displayClear: false,
        orderHistoryList: [],
        rowFocusFlagArray: [],
        animationData: {},
        showModalStatus: false,
        selectedOrder: Object,
        payChoice: [

        ],
        index: 0,
        rate: 0,
        qrCodeImg: "",
		qrCodeUrl: "",
        qrCodeModal: false,
		intervel: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    reset: function(e) {
        this.showOrderList();
        this.setData({
            search: '',
            displayClear: false
        });
    },

    //搜索还没做完
    searchOrder: function(e) {
        let self = this
        let orderHistoryList = this.data.orderHistoryList;
        let text = Util.trim(e.detail.value);
        let rows = [];
        for (var key in orderHistoryList) {
            let order = orderHistoryList[key];

            let name = order.consignee.name;
            let phone = order.consignee.phone;
            let items = order.orderGoods;
            let orderSN = order.orderInfo.orderSN;
            if (name.search(text) !== -1 || phone.search(text) !== -1 || orderSN.search(text) !== -1) {
                rows.push(order);
            } else {
                for (let x in items) {
                    if (items[x].title.toUpperCase().search(text.toUpperCase()) !== -1) {
                        rows.push(order);
                        break;
                    }
                }
            }
        }
        this.setData({
            orderHistoryList: rows,
            displayClear: true
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            rate: wx.getStorageSync("shopParams").rate
        })
        this.showOrderList();
    },

    showOrderList: function(e) {
        let self = this
        let url = COM.load('CON').GET_ALL_ORDERS_BUYER + app.globalData.openId;
        COM.load('NetUtil').netUtil(url, "GET", {}, (callback) => {
            console.log(callback)
            self.setData({
                orderHistoryList: callback
            })
        })
    },

    clickOrder: function(e) {
        wx.navigateTo({
            url: './detail/orderDetail?orderId=' + e.currentTarget.dataset.order,
        })
    },

    delOrder: function(e) {
        var self = this;
        wx.showModal({
            content: '确定取消此订单?',
            showCancel: true,
            confirmText: '确认',
            success: function(res) {
                if (res.confirm) {
                    try {

                        let orderList = self.data.orderHistoryList;
                        let newList = orderList.filter(function(val) {
                            return (val.orderInfo.orderId != e.currentTarget.dataset.order);
                        });
                        let url = COM.load('CON').CANCEL_ORDER_BUYER + e.currentTarget.dataset.order;
                        COM.load('NetUtil').netUtil(url, "PUT", {}, (callback) => {
                            console.log(callback)
                        })
                        wx.setStorage({
                            key: "orderHistoryList",
                            data: newList,
                            success: function() {
                                self.showOrderList();
                            }
                        })
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        })
    },

    placeOrder: function(e) {
        let self = this
        console.log(e)
        let orderId = e.currentTarget.dataset.order
        let url = COM.load('CON').REORDER_URL;
        COM.load('NetUtil').netUtil(url, "POST", {
            "orderId": orderId
        }, (callback) => {
            console.log(callback)
            if (callback.flag == true) {
                wx.showModal({
                    title: '下单成功',
                    content: '已经为您重新下单',
                    showCancel: false,
                    success: function(res) {
                        if (res.confirm) {
                            self.onShow()
                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '下单失败',
                    content: '店家已下架此商品或者无货',
                    showCancel: false,
                    success: function(res) {
                        if (res.confirm) {
                            self.onShow()
                        }
                    }
                })
            }
        })

    },
    getLogo: function(productId) {
        let products = wx.getStorageSync("shopProducts");
        return COM.load('Util').image(products[productId].barcode)
    },

    mytouchstart: function(e) {
        let self = this;
        let rowFocusFlagArray = [];
        var index = e.currentTarget.dataset.index;
        rowFocusFlagArray[index] = 1;
        self.setData({
            touch_start: e.timeStamp,
            rowFocusFlagArray: rowFocusFlagArray
        })
    },

    mytouchend: function(e) {
        let self = this;
        let rowFocusFlagArray = [];
        var index = e.currentTarget.dataset.index;
        rowFocusFlagArray[index] = 0;
        self.setData({
            touch_end: e.timeStamp,
            rowFocusFlagArray: rowFocusFlagArray
        })
    },

    // 显示遮罩层
    showModal: function(e) {
        let orderList = this.data.orderHistoryList;
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        console.log(orderList)
        console.log(e.currentTarget.dataset)
        console.log(orderList[e.currentTarget.dataset.id])
        let shop = orderList[e.currentTarget.dataset.id].sellerShop
        let payChoice = []
        if (shop.offlinePay)

            payChoice.push({
                id: 1,
                name: "线下支付"
            });
        if (shop.prepay) {
            let deposit = orderList[e.currentTarget.dataset.id].applyToShop.deposit
            payChoice.push({
                id: 2,
                name: "预存款支付(当前预存款为￥" + deposit + ")人民币"
            });
        }
        if (shop.weixinPay)
            payChoice.push({
                id: 3,
                name: "微信支付"
            });

        let selectedOrder = orderList[e.currentTarget.dataset.id];
        let rmb = Math.round(selectedOrder.orderInfo.totalCost * this.data.rate * 100) / 100;
        selectedOrder.orderInfo.rmb = rmb;
        this.setData({
            animationData: animation.export(),
            showModalStatus: true,
            selectedOrder: selectedOrder,
            payChoice: payChoice,
        })

        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },

    // 隐藏遮罩层
    hideModal: function() {
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
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },

    //确认支付
    payOrder: function(e) {
        var self = this;
        let order = self.data.selectedOrder;

        //1. offlinePay 2. prepay 3.weixinPay
        let payChoiceIndex = self.data.payChoice[self.data.index].id
        console.log
        if (payChoiceIndex == 2) {

            let rate = wx.getStorageSync("shopParams").rate;
            if (order.orderInfo.totalCost * 10000 * rate > order.applyToShop.deposit * 10000) {
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
                        success: function(res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    })
                } else if (callback.payChoice == 3) {
					if(callback.flag == false)
					{
						wx.showModal({
							title: '提示',
							content: '支付参数出现错误, 请尝试其他支付方式或者联系店家',
							showCancel:false,
							success:function(e){
								return
							}
						})
					}
                    if (callback.payment == 1) {
                        let params = callback.params;
                        wx.requestPayment({
                            'timeStamp': params.timeStamp,
                            'nonceStr': params.nonceStr,
                            'package': params.package,
                            'signType': params.signType,
                            'paySign': params.paySign,
                            'success': function(res) {
                                wx.showModal({
                                    title: '提示',
                                    content: '支付成功',
                                    showCancel: false,
                                    success: function(res) {
                                        if (res.confirm) {
                                            wx.navigateBack({
                                                delta: 1
                                            })
                                        }
                                    }
                                })
                            },
                            'fail': function(res) {
                                wx.showModal({
                                    title: '提示',
                                    content: '支付失败',
                                    showCancel: false,
                                    success: function(res) {

                                    }
                                })
                            },
                            'complete': function(res) {
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
							if(flag > 10)
							{
								clearInterval(interval)
								wx.showModal({
									title: '提示',
									content: '当前支付session结束，请点击确定刷新本页重新支付',
									showCancel:false,
									success:function(e){
										self.setData({
											qrCodeModal:false
										})
										self.onShow()
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
							}, true, false)
						}, 5000)

						self.setData({
							interval: interval
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
    hideQrCodeModal: function(e) {
        this.setData({
            qrCodeModal: false
        });
    },
    downloadQrcode: function() {
        let self = this
        wx.showLoading({
            title: '加载中...',
        })
		if (self.data.interval != "") {
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
    saveImageToPhoto: function() {
		let self = this
        if (this.data.savedImgUrl != "") {
            wx.saveImageToPhotosAlbum({
                filePath: this.data.savedImgUrl,
                success: function() {
                    wx.showModal({
                        title: '保存图片成功',
                        content: '二维码已经保存到相册，您可以扫描后支付啦！',
                        showCancel: false
                    });
                },
                fail: function(res) {
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
                            complete: function(res) {
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
                complete: function(e) {
                    wx.hideLoading();
					self.setData({
						qrCodeModal: false
					});
                },

            })
        }
    },
    bindPayChoiceChange: function(e) {

        this.setData({
            index: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
		this.onShow()

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    // /**
    //  * 用户点击右上角分享
    //  */
    // onShareAppMessage: function () {

    // }
})