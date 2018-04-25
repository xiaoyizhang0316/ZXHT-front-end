// page/mine/fans/fans.js
var app = getApp();
var COM = require('../../../../utils/common.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {


		fan: Object,
		applyToShop: {
			"openId": "",
			"shopId": "",
			"access": 0,
			"vipLevel": 0,
			"deposit": 0
		},
		vipArray: ["普通会员-无折扣", "青铜会员-9折", "白银会员-8折", "黄金会员-7折"],
		index: 0,
	},


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var pages = getCurrentPages();

		var prevPage = pages[pages.length - 2];  //上一个页面
		var fan = prevPage.data.selectedFan; //取上页data里的数据也可以修改
		console.log(fan)
		this.setData({
			fan: fan,
			index: fan.vipLevel,
			"applyToShop.openId": fan.openId,
			"applyToShop.shopId": app.globalData.openId,
			"applyToShop.access": fan.access,
			"applyToShop.vipLevel": fan.vipLevel,
			"applyToShop.deposit": fan.deposit,
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
	bindVipArrayChange: function (e) {
		console.log(e)
		this.setData({
			index: e.detail.value,
			"applyToShop.vipLevel": e.detail.value,
		})
	},
	bindDepositChange: function (e) {
		console.log(e)
		let deposit = e.detail.value
		if (deposit.match(/^[+-]?([0-9]*[.])?[0-9]+$/))
		{
			this.setData({
				"applyToShop.deposit": e.detail.value,
			})
		}else
		{
			wx.showToast({
				title: '数值错误，请检查您输入的预存款',
				icon: "none"
			})
		}
		
	},
	switchChange: function (e) {
		let self = this;
		let fan = this.data.fan
		console.log(e);
		if (!e.detail.value) {

			wx.showModal({
				title: '提示',
				content: '确认不允许此人进入店铺?',
				success: function (res) {

					self.setData({ "applyToShop.access": false })

					// 	if (res.confirm) {
					// 		fan.access = false
					// 		let url = COM.load('CON').FANS_ACCESS_URL;
					// 		COM.load('NetUtil').netUtil(url, 'PUT', fan, function (res) {

					// 			for (let i = 0; i < self.data.fansLineList.length; i++) {
					// 				if (self.data.fansLineList[i].id == e.currentTarget.dataset.id) {
					// 					self.data.fansLineList[i].access = false;
					// 				}
					// 			}
					// 			for (let i = 0; i < self.data.searchResult.length; i++) {
					// 				if (self.data.searchResult[i].id == e.currentTarget.dataset.id) {
					// 					self.data.searchResult[i].access = false;
					// 				}
					// 			}
					// 			self.setData({
					// 				fansLineList: self.data.fansLineList,
					// 				searchResult: self.data.searchResult
					// 			});


					// 		})
					// 	} else if (res.cancel) {
					// 		self.setData({ fansLineList: self.data.fansLineList });
					// 	}
				}
			})
		} else {

			self.setData({ "applyToShop.access": true })
			//允许进入
			// let fan = { "shop_id": app.globalData.openId, "open_id": targetOpenId, "access": true };
			// let url = COM.load('CON').FANS_ACCESS_URL;
			// COM.load('NetUtil').netUtil(url, 'PUT', fan, function (res) {
			// 	for (let i = 0; i < self.data.fansLineList.length; i++) {
			// 		if (self.data.fansLineList[i].id == e.currentTarget.dataset.id) {
			// 			self.data.fansLineList[i].access = true;
			// 		}
			// 	}
			// 	for (let i = 0; i < self.data.searchResult.length; i++) {
			// 		if (self.data.searchResult[i].id == e.currentTarget.dataset.id) {
			// 			self.data.searchResult[i].access = true;
			// 		}
			// 	}
			// 	// self.data.fansLineList[e.currentTarget.dataset.id -1].selected = true;
			// 	// self.data.searchResult[e.currentTarget.dataset.id - 1].selected = true;
			// 	self.setData({
			// 		fansLineList: self.data.fansLineList,
			// 		searchResult: self.data.searchResult
			// 	});


			// })
		};
		//once something changed should force refresh fans list page

	},


	saveFan: function () {
		let self = this
		let url = COM.load('CON').UPDATE_FAN_URL;

		console.log(url)
		console.log(self.data.applyToShop)
		if (self.data.applyToShop.deposit.match(/^[+-]?([0-9]*[.])?[0-9]+$/)) {
			let deposit = Math.round(self.data.applyToShop.deposit * 100) / 100

			this.setData({
				"applyToShop.deposit": deposit,
			})
			COM.load('NetUtil').netUtil(url, 'POST', self.data.applyToShop, function (res) {
				console.log(res)
				if (res == true) {
					wx.showToast({
						title: '数据更新成功',
						icon: 'success',
						duration: 1500,
						mask: true,
						success: function () {

							wx.setStorage({
								key: 'refreshFansList',
								data: true,
							})
							wx.navigateBack({

							})
						}
					})
				} else {
					wx.showToast({
						title: '数据更新失败，请重新尝试',
						icon: 'none',
						duration: 1500,
						mask: true,

					})
				}

			})
		} else {
			wx.showToast({
				title: '数值错误，请检查您输入的预存款',
				icon: "none"
			})
		}
		
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



})