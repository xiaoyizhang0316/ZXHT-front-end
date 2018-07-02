// page/mine/myShop/accountDetail/extraServices/extraServices.js
import WxValidate from "../../../../../utils/Validate/WxValidate.js"
import download from "../../../../../utils/downloadFile.js"
var COM = require('../../../../../utils/common.js');
var app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		services: [],

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];  //上一个页面
		this.setData({
			services: prevPage.data.extraServices ? prevPage.data.extraServices : []
		})
		console.log(prevPage)
		console.log("2222222222")

	},
	addService: function () {
		if (this.data.services.length >= 0 && this.data.services.length < 6) {
			let newService = {
				"name": "",
				"price": "",
				"shopId": app.globalData.openId,
				"enable": true,
			}
			let services = this.data.services
			services.push(newService)
			this.setData({
				services: services
			})

		} else if (this.data.services.length == 6) {
			wx.showModal({
				title: '提示',
				content: '最多六个额外服务',
				showCancel: false
			})
		}

	},
	deleteService: function (e) {
		console.log(e)
		let services = this.data.services
		if (services.length > 1 && services.length <= 6) {
			//services.splice(e.target.dataset.index, 1, "")
			services.pop()
			console.log(services)
			this.setData({
				services: services
			})

		} else if (this.data.services.length == 1) {
			this.setData({
				services: []
			})
		}
	},
	bindInputName: function (e) {
		let self = this
		let services = this.data.services
		if (e.detail.value.length > 4) {
			wx.showModal({
				title: '提示',
				content: '最多四个文字',
				success: function (res) {
					if (res.confirm) {
						services[e.target.dataset.index].name = ""
						self.setData({
							services: services
						})
					} 
				}
			})
			
		}else{
			services[e.target.dataset.index].name = e.detail.value
			self.setData({
				services: services
			})
		}
	},
	bindInputPrice: function (e) {
		console.log(e)
		let self = this
		let services = this.data.services
		if (e.detail.value != 0 && !/^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/.test(e.detail.value) ) {
			wx.showModal({
				title: '提示',
				content: '价格录入错误',
				success: function (res) {
					if (res.confirm) {
						services[e.target.dataset.index].price = 0
						self.setData({
							services: services
						})
					}

				}
			})
			
			
		}else{
			services[e.target.dataset.index].price = e.detail.value
			self.setData({
				services: services
			})
		}

	},
	
	changeEnableService: function (e) {
		let services = this.data.services
		services[e.target.dataset.index].enable = !services[e.target.dataset.index].enable
		this.setData({
			services: services
		})

	},
	formSubmit: function (e) {
		console.log(e)
	
		var self = this;
		let services = self.data.services;
		//验证services
		for(let i = 0; i< services.length; i++ )
		{
			let v = services[i]
			let k = i
			if (v.name == "" || !/^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/.test(v.price)) {	
				wx.showModal({
					title: '提示',
					content: '第' + (k + 1) + '项服务设置有错误,请核实后重新提交(名字和价格都是必填项)',
					showCancel: false,
					success: function (e) {

					}
				})
				return;
			}
		}
		// services.forEach(function(k,v){
			
		// 	if (v.name == "" || !/^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/.test(v.price))
		// 	{
		// 		console.log("wow3")
		// 		return;
		// 		wx.showModal({
		// 			title: '提示',
		// 			content: '第'+(k+1) +'项服务设置有错误,请核实后重新提交',
		// 			showCancel:false, 
		// 			success: function(e)
		// 			{
						
		// 			}
		// 		})
		// 		console.log("wow2")
		// 	}
		// })
		console.log("wow")
		if (services === []) {
			wx.navigateBack({
				delta: 1,
			})
			return;
		}
		console.log("wow1")
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];  //上一个页面
		prevPage.setData({
			extraServices: services
		})
		wx.navigateBack({
			delta: 1
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

	}
})