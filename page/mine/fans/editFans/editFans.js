// page/mine/fans/fans.js
var app = getApp();
var COM = require('../../../../utils/common.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		
		fan: Object,		
		tmp: { 'access': false, 'vipLevel': '1' },		
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
		this.setData({
			fan:fan,
			index:fan.vipLevel
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
	bindVipArrayChange: function(e){
		console.log(e)
		this.setData({
			index: e.detail.value
		})  
	},

	switchChange: function (e) {
		let self = this;
		let targetOpenId = ""
		for (let i = 0; i < self.data.fansLineList.length; i++) {
			if (self.data.fansLineList[i].id == e.currentTarget.dataset.id) {
				targetOpenId = self.data.fansLineList[i].openId;
			}
		}
		if (!e.detail.value) {
			let fan = { "shop_id": app.globalData.openId, "open_id": targetOpenId, "access": false };
			wx.showModal({
				title: '提示',
				content: '确认不允许此人进入店铺?',
				success: function (res) {
					if (res.confirm) {
						fan.access = false
						let url = COM.load('CON').FANS_ACCESS_URL;
						COM.load('NetUtil').netUtil(url, 'PUT', fan, function (res) {

							for (let i = 0; i < self.data.fansLineList.length; i++) {
								if (self.data.fansLineList[i].id == e.currentTarget.dataset.id) {
									self.data.fansLineList[i].access = false;
								}
							}
							for (let i = 0; i < self.data.searchResult.length; i++) {
								if (self.data.searchResult[i].id == e.currentTarget.dataset.id) {
									self.data.searchResult[i].access = false;
								}
							}
							self.setData({
								fansLineList: self.data.fansLineList,
								searchResult: self.data.searchResult
							});


						})
					} else if (res.cancel) {
						self.setData({ fansLineList: self.data.fansLineList });
					}
				}
			})
		} else {
			//允许进入
			let fan = { "shop_id": app.globalData.openId, "open_id": targetOpenId, "access": true };
			let url = COM.load('CON').FANS_ACCESS_URL;
			COM.load('NetUtil').netUtil(url, 'PUT', fan, function (res) {
				for (let i = 0; i < self.data.fansLineList.length; i++) {
					if (self.data.fansLineList[i].id == e.currentTarget.dataset.id) {
						self.data.fansLineList[i].access = true;
					}
				}
				for (let i = 0; i < self.data.searchResult.length; i++) {
					if (self.data.searchResult[i].id == e.currentTarget.dataset.id) {
						self.data.searchResult[i].access = true;
					}
				}
				// self.data.fansLineList[e.currentTarget.dataset.id -1].selected = true;
				// self.data.searchResult[e.currentTarget.dataset.id - 1].selected = true;
				self.setData({
					fansLineList: self.data.fansLineList,
					searchResult: self.data.searchResult
				});


			})
		};
		//once something changed should force refresh fans list page
		wx.setStorage({
			key: 'refreshFansList',
			data: true,
		})
	},
	// saveFan: function () {
	//   let self = this, url = COM.load('CON').SHOP_Fan_URL + '/saveOrUpdate';
	//   if (self.data.tmp && self.data.tmp.price) {
	//     self.setData({ 'selectedFan.price': self.data.tmp.price });
	//   }
	//   if (self.data.tmp && self.data.tmp.vipPrice) {
	//     self.setData({ 'selectedFan.vipPrice': self.data.tmp.vipPrice });
	//   }

	//   COM.load('NetUtil').netUtil(url, 'POST', self.data.selectedFan, function (res) {
	//     wx.showToast({
	//       title: '数据更新成功',
	//       success: function () {
	//         self.data.fansMap.set(self.data.selectedFan.FanId, self.data.selectedFan);
	//         for (let x in self.data.fansLineList) {
	//           if (self.data.fansLineList[x].FanId == self.data.selectedFan.FanId) {
	//             self.data.fansLineList[x] = self.data.selectedFan;
	//             break;
	//           }
	//         }
	//         self.setData({
	//           fansLineList: self.data.fansLineList,
	//           fansMap: self.data.fansMap,
	//           tmp: Object
	//         });

	//         self.hideModal();
	//       }
	//     })
	//   })
	// },


	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	share: function (event) {
		wx.navigateTo({
			url: '/page/mine/fans/share/share'
		})
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