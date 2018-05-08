// page/component/new-pages/user/user.js
var app = getApp()
var COM = require('../../../utils/common.js')

Page({
	data: {
		thumb: '',
		nickname: '',
		orders: [],
		hasAddress: false,
		address: {},
		touched: [],
		openShopButton: false,
	},
	onLoad() {
		var self = this;
		//如果未授权则不允许进入本页面
	},
	onShow() {
		var self = this;
		/**
     * 获取用户信息
     */
		self.setData({
			thumb: app.globalData.avatarUrl,
			nickname: app.globalData.nickName ? app.globalData.nickName : "未登陆用户"
		})
	},


	touchstart: function (e) {
		var id = e.currentTarget.dataset.id;
		var array = this.data.touched;
		array[id] = true;
		this.setData({
			touched: array
		})
	},

	touchend: function (e) {
		var id = e.currentTarget.dataset.id;
		var array = this.data.touched;
		array[id] = false;
		this.setData({
			touched: array
		})
	},

	buyerHelp:function(e)
	{
		wx.navigateTo({
			url: '/page/mine/helpCenter/buyerHelp/buyerHelp',
		})
	},
	sellerHelp:function(e){
		wx.navigateTo({
			url: '/page/mine/helpCenter/sellerHelp/sellerHelp',
		})

	},
	policy:function(e)
	{
		wx.navigateTo({
			url: '/page/mine/helpCenter/policy/policy',
		})
	},
	contactUs:function(e)
	{
		wx.navigateTo({
			url: '/page/mine/helpCenter/contactUs/contactUs',
		})
	},
})