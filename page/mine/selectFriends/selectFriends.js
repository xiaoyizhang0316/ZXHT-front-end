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
		transferOrderId : 0


	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let self = this
		console.log(options)

		
		var orderId = options.orderId;
		self.setData({transferOrderId : orderId})
		let pages = getCurrentPages();
		var prevPage = pages[pages.length - 2]
		let orderList = prevPage.data.orderHistoryList
		let order = orderList.filter(function (val) {
			if (val.orderInfo.id == orderId) {
				return val
			}
		});
		
			let transferOrder = order[0].orderInfo
			let transferOrderGoods = order[0].orderGoods
			this.setData({ transferOrder: transferOrder, transferOrderGoods: transferOrderGoods })
	


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

	onShareAppMessage: function (res) {
		let self = this
		return {
			title: '委托发货单',
			path: '/page/mine/transferOrder/transferOrder?orderId=' + self.data.transferOrderId,
			success: function (res) {
				let url = COM.load('CON').TRANSFER_ORDER;
				COM.load('NetUtil').netUtil(url, "POST", { 'openId': app.globalData.openId, 'orderId': parseInt(self.data.transferOrderId) }, (callback) => {
					console.log(callback)
					
					wx.showModal({
						title: '转发成功',
						content: '请等待朋友填写商品价格和邮费后，决定是否委托发货',
						showCancel: false,
						confirmText: '确认',
						success: function (res) {
						wx.navigateBack({
							delta: -2
						})
						},
						fail: function (res) { },
						complete: function (res) { },
					})
				})

				
			},
			fail: function (res) {
				// 转发失败
			}
		}


	},

})