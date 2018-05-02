// page/mine/shopSwitch/shopSwitch.js
var app = getApp()
var COM = require('../../../../utils/common.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		shop: {},
		balanceApply : 0,
	},


	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow: function () {
		this.loadShopBalance();
	},
	onLoad: function () {

	},

	loadShopBalance: function (e) {
		var self = this
		let openId = app.globalData.openId;
		//let url = "https://a5f93900.ngrok.io/api/mall/users/getShopsApplyToShop/" + openId;
		let url = COM.load('CON').GET_SHOP_BALANCE + openId;
		COM.load('NetUtil').netUtil(url, "GET", "", (shopMap) => {

			if (shopMap) {

				console.log(shopMap)
				self.setData({
					shop: shopMap
				})
			}
		});
	},
	balance_apply: function () {
		let b = this.data.balanceApply
		let shopId = app.globalData.openId
		if (b.toString().match(/^[+-]?([0-9]*[.])?[0-9]+$/)) {
			b = Math.round(b * 100) / 100

			if (b >= 100 && b * 100 < this.data.shop.balance) {
				let url = COM.load('CON').BALANCE_APPLY;
				COM.load('NetUtil').netUtil(url, "POST", { "shopId": shopId, "balanceApply": b }, (callback) => {
					console.log(callback)
					if (callback.flag == true) {
						wx.showModal({
							title: '申请成功',
							content: '申请已提交，资金会在3-5个工作日内到账',
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									wx.navigateBack({

									})
								}
							}
						})
					} else {
						wx.showModal({
							title: '申请失败',
							content: callback.message,
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									self.onShow()
								}
							}
						})
					}
				})

			} else {
				wx.showModal({
					title: '提示',
					content: '提现输入必须大于100元且多余当前余额！',
				})
			}
		} else {
			wx.showModal({
				title: '提示',
				content: '提现输入有误，请检查后输入',
			})
		}

		
	},
	balanceChange: function (e) {
		console.log(e)
		let b = e.detail.value
		let self = this
		self.setData({
			balanceApply: b
		})
		
		
	},
	/** 
	 * 点击tab切换 
	 */




	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */


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
})