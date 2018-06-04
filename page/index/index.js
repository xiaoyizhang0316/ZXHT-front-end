var app = getApp();
// var NetUtil = require('../../utils/netUtil.js')
// var Util = require('../../utils/util.js')
// var CON = require('../../utils/constant.js')

var COM = require('../../utils/common.js')

Page({
	data: {
		page: 1,
		pageSize: 30,
		hasMoreData: true,
		goodsList: {},
		hotList: {},
		discountList:{},
		shop: [],
		imgUrls: [
		
			'https://img.zhenxianghaitao.com/siteImages/slide1.png',
			'https://img.zhenxianghaitao.com/siteImages/slide2.png',
			'https://img.zhenxianghaitao.com/siteImages/slide3.png'
		],
		indicatorDots: false,
		autoplay: false,
		interval: 5000,
		duration: 1000,
		focus: false,
		displayClear: false,
		userinfo: '',
		targetShopId: null,
		sign:"",
		shopImg:"",
		userName:"",
		rate: 5,
		currentTab: 0,

	},

	onLoad: function (options) {

	},


	onShow: function () {
		var self = this;
		self.loadRecommendedProducts();

		wx.getSystemInfo({
			success: function (res) {
				self.setData({
					winWidth: res.windowWidth,
					winHeight: res.windowHeight,
				});
			}
		});
		// setTimeout(function () {
		//   wx.hideLoading()
		// }, 100);
		self.resetSearch();

		//设置页面标题

		var openId = "";
		//let url = "https://a5f93900.ngrok.io/api/mall/shops/openId/" + targetShopId

		if (app.globalData.targetShopId != null && app.globalData.targetShopId != "") {
			openId = app.globalData.targetShopId;
			let url = COM.load('CON').getMyShopInfo + openId
			COM.load('NetUtil').netUtil(url, "GET", "", (callbackdata) => {
				if (callbackdata == null) {

				} else {
					wx.setNavigationBarTitle({
						title: callbackdata.shopName,
					})
					self.setData({
						sign: callbackdata.sign,
						shopImg: callbackdata.shopImg,
						userName: callbackdata.userName
					})

					//self.loadRecommendedProducts();
				}
			})
		} else {
			wx.setNavigationBarTitle({
				title: '真享 海淘',
			})
		}
		this.setData({
			rate: parseFloat(Math.round(wx.getStorageSync("shopParams").rate * 100) / 100).toFixed(2)
		})
	
	},
	bindChange: function (e) {

		var that = this;
		that.setData({ currentTab: e.detail.current });
	},
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
  /**
   * load the recomemded products by the shop id
   */
	loadRecommendedProducts: function (event) {
		let self = this
		//如果有targetShopId 则优先展示
		let targetShopId = ""
		self.setData({
			goodsList: {},
			hotList: {}
		})
	
		let shopProducts = wx.getStorageSync("shopProducts");
	
		var shopProductIds = [];
		for (var x in shopProducts) {
			let shopProduct = shopProducts[x];
			shopProductIds.push(shopProduct.id);
			if (shopProduct.stock >= 0 && shopProduct.vipPrice >= 0 && shopProduct.recommend) {
				self.data.goodsList[shopProduct.id] = {
					"id": shopProduct.id,
					"title": shopProduct.title,
					"price": shopProduct.basePrice,
					"vipPrice": shopProduct.discountPrice && shopProduct.discount? shopProduct.discountPrice : shopProduct.vipPrice,
					"sales": shopProduct.sales,
					"thumb": COM.load('Util').image(shopProduct.barcode),					
				}
			}
			if (shopProduct.stock >= 0 && shopProduct.vipPrice >= 0 && shopProduct.hot) {
				self.data.hotList[shopProduct.id] = {
					"id": shopProduct.id,
					"title": shopProduct.title,
					"price": shopProduct.basePrice,
					"vipPrice": shopProduct.discountPrice && shopProduct.discount ? shopProduct.discountPrice : shopProduct.vipPrice,
					"sales": shopProduct.sales,
					"thumb": COM.load('Util').image(shopProduct.barcode),		
				}
			}
			if (shopProduct.stock >= 0 && shopProduct.discountPrice >= 0 && shopProduct.discount) {
				self.data.discountList[shopProduct.id] = {
					"id": shopProduct.id,
					"title": shopProduct.title,
					"price": shopProduct.basePrice,
					"vipPrice": shopProduct.discountPrice ? shopProduct.discountPrice : shopProduct.vipPrice,
					"sales": shopProduct.sales,
					"thumb": COM.load('Util').image(shopProduct.barcode),
				}
			}
		}
		self.setData({
			goodsList: self.data.goodsList,
			hotList: self.data.hotList,
			discountList: self.data.discountList
		})
		
		wx.setStorage({
			key: 'shopProductIds',
			data: shopProductIds,
		})

		console.log(self.data.goodsList)
		console.log(self.data.hotList)
		console.log(self.data.discountList)
		
	},

	

	bindSearch: function (event) {
	if(this.data.focus == false)
	{
		wx.navigateTo({
			url: '/page/index/search/search'
		})
	}
	self.setData({
		focus: true
	})
	},

	resetSearch: function (e) {
		this.setData({ order: '', displayClear: false })
	},

	scanCode: function () {
		let self = this;
		wx.scanCode({
			success: (res) => {
				if (res.result) {
					self.searchByBarcode(COM.load('Util').trim(res.result));
				} else {
					wx.showModal({
						title: '提示',
						content: '商品不能为空！',
						showCancel: false,
						success: function (res) {
							if (res.confirm) {
								self.setData({
									focus: true
								})
							}
						}
					})
				}
			},
			fail: (res) => {
				wx.showModal({
					title: '提示',
					content: '扫码失败，请重新尝试下',
					showCancel: false,
					success: function (res) {
						console.log('scan code failed')
					}
				})
			}
		})
	},

  /**
   * search the barcode only from internet
   */
	searchByBarcode: function (barcode) {
		var self = this, item;

		let searchHistoryList = wx.getStorageSync('searchHistoryList');
		if (!searchHistoryList) {
			searchHistoryList = [];
		};

		// console.log(COM.load('CON').BAR_CODE_URL+barcode)

		COM.load('NetUtil').netUtil(COM.load('CON').BAR_CODE_URL + barcode, "GET", "", function (res) {
			item = res;
			// console.info(item);

			if (item) {
				//目前historyList中只存title
				for (var x in searchHistoryList) {
					//console.log(x)
					if (searchHistoryList[x].name == item.title) {
						searchHistoryList.splice(x, 1)
						break;
					}
				}

				//限制搜索记录为10个
				while (searchHistoryList.length >= 10) {
					searchHistoryList.shift()
				}

				var newItem = {
					name: item.title
				}
				searchHistoryList.push(newItem);

				wx.setStorage({
					key: "searchHistoryList",
					data: searchHistoryList,
				})
				console.log('finded')

				wx.navigateTo({
					url: '/page/details/details?id=' + item.id
				})
			} else {
				wx.showModal({
					title: '提示',
					content: '小店还没有上架此商品>_<，客官您再看看别的呀',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							self.addItem(e, barcode);
						}
					}
				})
			}
		});

	},

	onShareAppMessage: function () {
		let self = this
		let shopOpen = wx.getStorageSync('shopOpened')
		let openId = ""
		if(shopOpen == true)
		{
			openId = app.globalData.openId;
		}else{
			openId = "oVxpo5FQkb2qY4TGpD9rq2xFWRlk"
		}
		
		console.log(wx.getStorageSync('shopOpened'))
		console.log(openId)
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
	},

	onReady: function () {
		var timestamp = Date.parse(new Date());
		timestamp = timestamp / 1000;
		console.log('index page ready at: ' + timestamp)
	},

	onPullDownRefresh() {
		let self = this
		console.log('--------下拉刷新-------')
		COM.load('NetUtil').netUtil(COM.load('CON').GET_TARGETSHOP_PRODUCTS_URL + app.globalData.openId + "/" + app.globalData.targetShopId, "GET", "", function (shopProducts) {

			if (shopProducts) {
				console.log(shopProducts)
				wx.setStorageSync("shopProducts", shopProducts)
			};
		

			self.onLoad()
			self.onShow()
			wx.stopPullDownRefresh()


		})
	
	},
	onConfirm: function (e) {
		let self = this
		
		
		//储存用户信息
		console.log("********************")
		app.globalData.nickName = e.detail.userInfo.nickName
		app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
		wx.setStorage({
			key: 'nickname',
			data: app.globalData.nickName
		})
		wx.setStorage({
			key: 'avatarUrl',
			data: app.globalData.avatarUrl
		})

		self.saveOrUserData(e.detail.userInfo)
	},
	saveOrUserData: function (userInfo) {

		var self = this
		let url = COM.load('CON').CREATE_OR_UPDATE_USER;
		COM.load('NetUtil').netUtil(url, "POST", { "open_id": app.globalData.openId, "name": userInfo.nickName, "avatarUrl": userInfo.avatarUrl, "country": userInfo.country, "province": userInfo.province, "city": userInfo.city }, (callback) => {
			app.globalData.userId = callback;
			wx.setStorage({
				key: 'userId',
				data: callback,
			})
		})
	},


})

