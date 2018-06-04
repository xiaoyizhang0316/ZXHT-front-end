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
		console.log(options)
		if (Object.prototype.toString.call(options) !== '[object Undefined]' && Object.prototype.toString.call(options.orderId) !== '[object Undefined]') {
			let orderId = options.orderId
			let url = COM.load('CON').GET_TRANSFER_ORDER + '/' + app.globalData.openId + '/' + orderId;
			COM.load('NetUtil').netUtil(url, "GET", '', (transferOrderFull) => {
				
				console.log(transferOrderFull)
				let transferOrder = transferOrderFull.transferOrder
				let transferOrderGoods = transferOrderFull.transferOrderGoods
				this.setData({ transferOrder: transferOrder, transferOrderGoods: transferOrderGoods })
			})

		} else {
			wx.showModal({
				title: '参数错误',
				content: '参数错误，请重新尝试',
				success: function (res) {
					if (res.confirm) {

						wx.navigateBack({
							delta: -2
						})
					} else if (res.cancel) {

						wx.navigateBack({
							delta: -2
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

	acceptOffer: function (e) {

		let transferOrderId = e.currentTarget.dataset.order
		let url = COM.load('CON').ACCEPT_TRANSFER_ORDER + app.globalData.openId + '/' + transferOrderId;
		console.log(url);
		COM.load('NetUtil').netUtil(url, "GET", "", (res) => {
			if(res.flag == true)
			{
				wx.showModal({
					title: '成功',
					content: '委托完成, 请于线下完成付款。',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定')
							wx.navigateBack({
								delta: -2
							})
						}
					}
				})
			}else{
				wx.showModal({
					title: '失败',
					content: res.errorMessage,
					showCancel: false,
					success:function(res){
						if (res.confirm) {
							console.log('用户点击确定')
							wx.navigateBack({
								delta: -2
							})
						} 
					}
				})
			}
		})

	},
	declineOffer: function (e) {
		let transferOrderId = e.currentTarget.dataset.order
		let url = COM.load('CON').DECLINE_TRANSFER_ORDER + app.globalData.openId + '/' + transferOrderId;
		COM.load('NetUtil').netUtil(url, "GET", "", (res) => {
			console.log(res)
		})

	}

	/**
	 * 用户点击右上角分享
	 */
	//   onShareAppMessage: function () {

	//   }
})