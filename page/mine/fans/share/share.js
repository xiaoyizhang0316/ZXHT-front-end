// page/mine/share/share.js
var app = getApp()
var COM = require('../../../../utils/common.js')

Page({
	data: {
		thumb: '',
		nickname: '',
		openId: '',
		shopId: '',
		sign: '',
		shopName: '',
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad() {
		var self = this;
		/**
		* 获取用户信息
		*/
		self.setData({
			thumb: app.globalData.avatarUrl,
			nickname: app.globalData.nickName,
			openId: app.globalData.openId,
			shopId: app.globalData.shopId,
		})


		//let url = COM.load('CON').ShopInfo + self.data.openId;
		let url = COM.load("CON").getMyShopInfo + self.data.openId
		COM.load('NetUtil').netUtil(url, "GET", "", (shopInfo) => {
			if (shopInfo) {
				console.log(shopInfo)
				self.setData({
					sign: shopInfo.sign
					//shopName: shopInfo.shopName
				})

			}
		});
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

	/**
	* 用户点击右上角分享
	*/
	onShareAppMessage: function () {
		let self = this
		let openId = app.globalData.openId;
		return {
			title: '真实澳洲直邮 朋友分享的海淘',
			desc: self.data.sign,
			path: '/page/welcome/welcome?targetShopId=' + openId,
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	}
})
