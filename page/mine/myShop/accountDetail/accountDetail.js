var app = getApp()
var COM = require('../../../../utils/common.js')
import WxValidate from "../../../../utils/Validate/WxValidate.js"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		shop: {
			shopname: '',
			sign: '',
			payment: 1,//默认支付方式为人民币
			bankName: '',
			accountNbr: '',
			accountName: '',
			rate: 0,
			vip1: 1,
			vip2: 1,
			vip3: 1,

		},
		payItems: [
			{ name: '人民币', value: 1, checked: false },
			{ name: 'Australian Dollar', value: 2, checked: false },
		],
		tips: {
			zh_cn: '请填写对应的支付信息',
			en: 'Please fill in the payment information.'
		},
		showModalStatus: false,
		prepayStatus: false,
		offlinePayStatus: false,
		weixinPayStatus: false,
		freePostStatus: false,

		//名为memo 实际是shopNote 使用template的原因
		memo: '',
		extraServices: [],
		showAmountModal: {
			showModal: 'hideModal',
			showMask: 'hideMask',
		},

	},
	bindFreePost: function () {
		this.setData({
			'freePostStatus': !this.data.freePostStatus
		})
	},
	bindPrePay: function () {
		this.setData({
			'prepayStatus': !this.data.prepayStatus
		})
	},
	bindShopCopu:function(e){
		this.setData({
			'shopCopyStatus': !this.data.shopCopyStatus
		})
	},

	bindOfflinePay: function () {
		this.setData({
			'offlinePayStatus': !this.data.offlinePayStatus
		})
	},
	showModal: function () {
		console.log(this.data.showModalStatus)
		this.setData({
			'showModalStatus': !this.data.showModalStatus,
			'weixinPayStatus': !this.data.weixinPayStatus,
		})
		console.log(this.data.weixinPayStatus)
	},
	bindName: function (e) {
		console.log(e)
		this.setData({
			'shop.name': e.detail.value
		})
		console.log(this.data.shop.shopname)
	},

	bindSign: function (e) {
		this.setData({
			'shop.sign': e.detail.value
		})
	},
	bindbankName: function (e) {
		this.setData({
			'shop.bankName': e.detail.value
		})
	},
	bindRate: function (e) {
		this.setData({
			'shop.rate': e.detail.value
		})
	},
	bindaccountNbr: function (e) {
		this.setData({
			'shop.accountNbr': e.detail.value
		})
	},
	bindaccountName: function (e) {
		this.setData({
			'shop.accountName': e.detail.value
		})
	},
	bindExtra: function () {
		let self = this
		console.log(self.data)
		wx.navigateTo({
			url: "/page/common/templates/textArea/textArea?content=" + self.data.memo + "&placeHolder=请设定本店铺的用户须知"
		})
	},
	bindExtraServices: function () {
		let self = this
		wx.navigateTo({
			url: "/page/mine/myShop/accountDetail/extraServices/extraServices"
		})
	},
	bindVipSetup: function () {
		let self = this
		self.setData({
			showAmountModal: {
				showModal: 'showModal',
				showMask: 'showMask',
			}
		})

	},
	hideAmountModal: function (e) {
		var self = this;
		self.setData({
			showAmountModal: {
				showModal: 'hideModal',
				showMask: 'hideMask',
			},
		})
	},
	radioChange: function (e) {
		this.setData({
			'shop.payment': e.detail.value,
		})
		console.log(this.data.shop)
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var self = this;
		//let url = "https://a5f93900.ngrok.io/api/mall/shops/openId/" + wx.getStorageSync("openId")
		let url = COM.load("CON").getMyShopInfo + wx.getStorageSync("openId")

		COM.load('NetUtil').netUtil(url, "GET", "", (myShopInfo) => {
			console.log(myShopInfo)
			self.setData({
				'shop.id': myShopInfo.id,
				'shop.name': myShopInfo.shopName,
				'shop.sign': myShopInfo.sign,
				'shop.payment': myShopInfo.payment,
				'shop.bankName': myShopInfo.bankName,
				'shop.accountNbr': myShopInfo.accountNbr,
				'shop.accountName': myShopInfo.accountName,
				'shop.shopId': wx.getStorageSync('shopId'),
				'prepayStatus': myShopInfo.prepay,
				'offlinePayStatus': myShopInfo.offlinePay,
				'weixinPayStatus': myShopInfo.weixinPay,
				'shop.rate': parseFloat(myShopInfo.rate),
				'memo': myShopInfo.shopNote ? myShopInfo.shopNote : "",
				'freePostStatus': myShopInfo.freePost,
				'shopCopyStatus': myShopInfo.shopCopy,
				'extraServices': myShopInfo.extraServices,
				'shop.vip1': myShopInfo.vip1*100,
				'shop.vip2': myShopInfo.vip2*100,
				'shop.vip3': myShopInfo.vip3*100
			})
			if (self.data.shop.payment) {
				let payItems = self.data.payItems
				for (var i in payItems) {

					if (self.data.shop.payment == payItems[i].value) {
						payItems[i].checked = true
					}
				}
				self.setData({
					payItems: payItems
				})
			}


		})
	},

	formSubmit: function (e) {

		let self = this

		let url = COM.load('CON').CREATE_SHOP;

		// 验证字段的规则
		const rules = {
			shopname: {
				required: true
			},
			sign: {
				required: true
			},

			bankName: {
				required: self.data.weixinPayStatus ? true : false
			},
			accountNbr: {
				required: self.data.weixinPayStatus ? true : false,
				digit: self.data.weixinPayStatus ? true : false
			},
			accountName: {
				required: self.data.weixinPayStatus ? true : false
			}
		}

		// 验证字段的提示信息，若不传则调用默认的信息
		const messages = {
			shopname: {
				required: '请输入店名'
			},
			sign: {
				required: '请输入店铺签名'
			},
			bankName: {
				required: '请输入开户行'
			},
			accountNbr: {
				required: '请输入户名',
				digit: '请输入正确的户名'
			},
			accountName: {
				required: '请输入账户'
			}
		}
		// 创建实例对象
		this.WxValidate = new WxValidate(rules, messages)

		// paymethods = {
		// 	'prepayStatus': self.data.prepayStatus,
		// 	'offlinePayStatus': self.data.offlinePayStatus,
		// 	'weixinPayStatus': self.data.weixinPayStatus
		// }
		if (!self.data.prepayStatus && !self.data.offlinePayStatus && !self.data.weixinPayStatus) {
			wx.showModal({
				title: '开店失败',
				content: "请至少选择一个支付方式"
			})
			return
		}
		if (!self.data.shop.rate.toString().match(/^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/)) {
			wx.showModal({
				title: '开店失败',
				content: "请输入正确的汇率 e.g 0.00"
			})
			return
		}
		// 传入表单数据，调用验证方法
		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList[0]
			wx.showModal({
				title: '开店失败',
				content: error.msg
			})
		} else {
			let params = {
				"shop": {
					"id": self.data.shop.id,
					"id": self.data.shop.id,
					"open_id": app.globalData.openId,
					"owner": app.globalData.nickName,
					"shopName": self.data.shop.name,
					"sign": self.data.shop.sign,
					"prepay": self.data.prepayStatus,
					"offlinePay": self.data.offlinePayStatus,
					"rate": self.data.shop.rate,
					"shopNote": self.data.memo,
					"freePost": self.data.freePostStatus,
					"shopCopy": self.data.shopCopyStatus,
					"vip1": self.data.shop.vip1/100,
					"vip2": self.data.shop.vip2/100,
					"vip3": self.data.shop.vip3/100,
					//   "weixinPay": self.data.weixinPayStatus,
					//   "payment": self.data.shop.payment,
					//   "bankName": self.data.shop.bankName,
					//   "accountNbr": self.data.shop.accountNbr,
					//   "accountName": self.data.shop.accountName

				},
				"extraServices":
				self.data.extraServices
			}

			COM.load('NetUtil').netUtil(url, "POST", params, (callbackdata) => {
				if (callbackdata == true) {
					console.log("成功")
					wx.navigateBack({

					})


				}
				else {
					console.log("失败")
					wx.showModal({
						title: '开店失败',
						content: '请检查你填写的信息'
					})
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
	vipDiscount:function(e)
	{
		let vip1 = e.detail.value.vip1;
		let vip2 = e.detail.value.vip2;
		let vip3 = e.detail.value.vip3;
		let self = this
		if (!(Number.isInteger(parseInt(vip1)) && vip1>0 && vip1<=100))
		{
			wx.showModal({
				title: '提示',
				content: '白银会员折扣设置有误',
				showCancel: false,
				success: function (e) {
					return;
				}
			})
		}
		if (!(Number.isInteger(parseInt(vip2)) && vip2 > 0 && vip2 <= 100)) {
			wx.showModal({
				title: '提示',
				content: '黄金会员折扣设置有误',
				showCancel: false,
				success: function (e) {
					return;
				}
			})

		}
		
		if (!(Number.isInteger(parseInt(vip3)) && vip3 > 0 && vip3 <= 100)) {
			wx.showModal({
				title: '提示',
				content: '商铺代理折扣设置有误',
				showCancel: false,
				success: function (e) {
					return;
				}
			})

		}
		self.setData({
			'shop.vip1':vip1,
			'shop.vip2':vip2,
			'shop.vip3':vip3
		})
		self.hideAmountModal();

	}


})