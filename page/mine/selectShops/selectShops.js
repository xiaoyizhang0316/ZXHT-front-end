// page/mine/selectShops/selectShops.js
var app = getApp()
var COM = require('../../../utils/common.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		
		openId: '',
		shopLineList: {},
		shopMap: Object,
		shopList: [

		],
		idolList: [

		],
		selectedShop: {},
		isSelect: false,

		winWidth: 0,
		winHeight: 0,
		// tab切换  
		currentTab: 0,
		vipArray: ["青铜会员", "白银会员", "黄金会员", "钻石会员"],
		transferOrderId: 0
	},


	radioChange: function (e) {
		console.log(this.data.shopLineList[e.detail.value])
		this.setData({
			selectedShop: this.data.shopLineList[e.detail.value],
			isSelect: true
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		var self = this;
		let transferOrderId = options.orderId
		self.setData({transferOrderId:transferOrderId})
		/** 
		* 获取系统信息 
		*/
		wx.getSystemInfo({
			success: function (res) {
				self.setData({
					winWidth: res.windowWidth,
					winHeight: res.windowHeight,
				});
			}
		});
	},

	loadShop: function (e) {
		var self = this
		let openId = app.globalData.openId;
		//let url = "https://a5f93900.ngrok.io/api/mall/users/getShopsApplyToShop/" + openId;
		let url = COM.load('CON').GET_SHOPS_APPLY_TO_SHOP + openId;
		COM.load('NetUtil').netUtil(url, "GET", "", (shops) => {
			let shopMap = new Map();
			if (shops) {
				console.log(shops)
				//console.log(self.globalData)
				for (var x in shops) {
					let shop = shops[x];
					if (app.globalData.targetShopId == shop.shop.openId) {
						shopMap.set(shop.shop.id,
							{
								"id": shop.shop.id,
								"shop_name": shop.shop.shopName,
								"shop_logo": shop.user.avatarUrl,
								"shop_sign": shop.shop.sign,
								"shop_openId": shop.shop.openId,
								"deposit": shop.applyToShop.deposit,
								"vipLevel": this.data.vipArray[shop.applyToShop.vipLevel],
								"selected": true
							})
						this.setData({
							selectedShop: shopMap.get(shop.shop.id),
							isSelect: true
						});
					}
				}


				for (var x in shops) {
					let shop = shops[x];
					if (app.globalData.targetShopId != shop.shop.openId) {
						shopMap.set(shop.shop.id,
							{
								"id": shop.shop.id,
								"shop_name": shop.shop.shopName,
								"shop_logo": shop.user.avatarUrl,
								"shop_sign": shop.shop.sign,
								"shop_openId": shop.shop.openId,
								"deposit": shop.applyToShop.deposit,
								"vipLevel": this.data.vipArray[shop.applyToShop.vipLevel],
								"selected": false
							})
					}
				}

				console.log(shopMap)
				self.setData({
					shopLineList: Array.from(shopMap.values()),
					shopMap: shopMap
				})
			}
		});
	},

	bindChange: function (e) {

		var that = this;
		that.setData({ currentTab: e.detail.current });

	},

	/** 
	 * 点击tab切换 
	 */
	swichNav: function (e) {
		var that = this;
		if (this.data.currentTab == e.target.dataset.current) {
			return false;
		} else {
			that.setData({
				currentTab: e.target.dataset.current
			})
		}
	},

	switchShop: function (e) {
		let self = this
		let targetShopId = e.currentTarget.dataset.id
		let transferOrderId = self.data.transferOrderId
		wx.showModal({
			title: '提示',
			content: '确认将订单' + transferOrderId + "委托给" + self.data.selectedShop.shop_name+"吗?",
			success: function (res) {
				if (res.confirm) {
					let url = COM.load('CON').TRANSFER_ORDER
					
					COM.load('NetUtil').netUtil(url, "POST", { "orderId": Number(transferOrderId), "targetShopId":targetShopId}, (res) => {
						if(res.flag == true)
						{
							wx.showModal({
								title: '委托成功',
								content: '委托成功,请等待被委托人出价',
								showCancel:false,
								success:function(res){
									if(res.confirm)
									{
										wx.navigateBack({
											delta: -2
										})
									}
								}
							})
						}
					});
				}
			}
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
		this.loadShop();
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
	// onShareAppMessage: function () {

	// }
})