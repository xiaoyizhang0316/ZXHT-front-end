var app = getApp();
var COM = require('../../utils/common.js');
Page({
	data: {
		res: {},
		leftCategory: [
			{ name: '所有品牌', ename: 'brands', banner: '/image/c1.png' },
		],
		rightCategory: [],
		items: [],
		brands: [], //所有品牌
		products: {}, //各分类产品
		curIndex: 0,
		isScroll: false,
		// scrollTop: 0, //scroll-view回到顶部 todo
		toView: 'brands',
		curName: '所有品牌',
		curEName: 'brands',
		curBanner: '/image/c1.png',
		targetShopId: ""
	},

	onLoad: function (options) {
		console.log("eeeeeeeeeeeeessssssssssssssssssssssssssssssssssssss")
		
	},
	onShow: function(options)
	{
		let self = this
		//每次进入 清空leftcate
		if (self.data.leftCategory.length > 0) {
			self.setData({
				leftCategory: [
					{ name: '所有品牌', ename: 'brands', banner: '/image/c1.png' },
				],
				rightCategory: []
			});
		}
		//如果有targetShopId 则优先展示
		let targetShopId = ""
		console.log(app.globalData)
		if (app.globalData.targetShopId != "" && app.globalData.targetShopId != null) {
			targetShopId = app.globalData.targetShopId;
		} else {
			targetShopId = app.globalData.openId;
		}
		self.setData({ targetShopId: targetShopId })
		self.loadCategoies();
		self.filterProducts();
		self.setData({ brands: self.filterBrands() });
		self.setData({ items: self.data.brands });
	},

	loadCategoies: function () {
		let self = this;
		
		let targetShopId = this.data.targetShopId
		let url = COM.load('CON').CATEGORY_URL + "openId/" + targetShopId
		console.log("cate url here")
		console.log(url)
	
		COM.load('NetUtil').netUtil(url, "GET", "", function (res) {
			console.log(res)
			for (var x in res) {
				var cat = {
					name: res[x].name,
					ename: res[x].id,
					banner: '/image/c1.png'
				}
				self.data.leftCategory.push(cat);
			}
			self.setData({ res: res, leftCategory: self.data.leftCategory });
		})

		wx.getSystemInfo({
			success: function (res) {
				self.setData({
					winWidth: res.windowWidth,
					winHeight: res.windowHeight,
				});
			}
		});
	},

	// filterBrands: function () {
	//   let shopBrands = new Set();
	//   let brands = wx.getStorageSync("brands");
	//   let products = wx.getStorageSync("shopProducts");
	//   let shopProductIds = wx.getStorageSync("shopProductIds");
	//   for (var x in shopProductIds) {
	//     shopBrands.add(brands[products[shopProductIds[x]].brand]);
	//   }

	//   return Array.from(shopBrands);
	// },

	filterBrands: function () {
		let targetShopId = this.data.targetShopId
		let shopBrands = new Set();
		let brands = wx.getStorageSync("brands");
		let products = wx.getStorageSync("shopProducts");
		let shopProductIds = wx.getStorageSync("shopProductIds");
		for (var x in shopProductIds) {
			shopBrands.add(brands[products[shopProductIds[x]].brand]);
		}
		console.log(shopBrands);

		return Array.from(shopBrands);
	},

	filterProducts: function () {
		let self = this
		let targetShopId = this.data.targetShopId
		let productsMap = new Map();
		let products = []
		//let products = wx.getStorageSync("shopProducts");
		//let p = wx.getStorageSync("shopProducts");

		//修改 product为从服务器读取
		let openId = app.globalData.openId

		// COM.load('NetUtil').netUtil(COM.load('CON').GET_TARGETSHOP_PRODUCTS_URL + openId + "/" + targetShopId, "GET", "",function (shopProducts) {
			let shopProducts = wx.getStorageSync("shopProducts")
			if (shopProducts) {
				//console.log("shop products")
				//console.log(shopProducts);

				for (var x in shopProducts) {
					let shopProduct = shopProducts[x];

					if (shopProduct.stock >= 0 && shopProduct.vipPrice >= 0) {
						products[shopProduct.id] = {
							"id": shopProduct.id,
							"title": shopProduct.title,
							"price": shopProduct.basePrice,
							"vipPrice": shopProduct.vipPrice,
							"stock": shopProduct.stock,
							"sales": shopProduct.sales,
							"barcode": shopProduct.barcode,
							"thumb": COM.load('Util').image(shopProduct.barcode),

						}
					}
				}

				//console.log(products)
				// let shopProductIds = wx.getStorageSync("shopProductIds");
				// for (var x in shopProductIds) {
				// 	let key = undefined;
				// 	let list = productsMap.get(key) ? productsMap.get(key) : [];
				// 	list.push(products[shopProductIds[x]]);
				// 	productsMap.set(key, list);
				// }
				// console.log("productsMap")
				// console.log(productsMap)
				//key是undefined ???

			}
			
			self.setData({ products : products });
		// })


	},

	bindSearch: function (event) {
		wx.navigateTo({
			url: '/page/index/search/search'
		})
	},

	switchTab(e) {
		//右侧的scroll-view回到顶部 todo
		// this.this.setData({ scrollTop: 0, })

		const self = this;
		this.setData({
			isScroll: true,
			curIndex: e.target.dataset.index,
			curName: this.data.leftCategory[e.target.dataset.index].name,
			curEName: this.data.leftCategory[e.target.dataset.index].ename,
			curBanner: this.data.leftCategory[e.target.dataset.index].banner,
		})

		if (e.target.dataset.index == 0) {
			
			this.setData({ items: this.data.brands, rightCategory: [this.data.brands] });
			
		} else {
			let subCategories = this.data.res[e.target.dataset.index - 1].subCategories;
			let rightCategory = [];

			//let products = wx.getStorageSync("shopProducts");
			let products = this.data.products
			subCategories.forEach(function (subCat) {
				subCat.productIds.forEach(function (val, index, arr) {
					var id = (typeof val == 'object') ? val.id : val					
					arr[index] = products[id]
					
				})
			})
			this.setData({
				rightCategory: subCategories
			});

			// let list = this.data.products.get(e.target.dataset.index + 1);
			// list = list ? list : [];
			// this.setData({ items: list });
		}

		setTimeout(function () {
			self.setData({
				toView: e.target.dataset.id,
				curIndex: e.target.dataset.index
			})
		}, 0)

		setTimeout(function () {
			self.setData({
				isScroll: true
			})
		}, 1)

	},
	onPullDownRefresh() {
		
		console.log('--------下拉刷新-------')
		let self = this
		//每次进入 清空leftcate
		if (self.data.leftCategory.length > 0) {
			self.setData({
				leftCategory: [
					{ name: '所有品牌', ename: 'brands', banner: '/image/c1.png' },
				],
				rightCategory: []
			});
		}
		//如果有targetShopId 则优先展示
		let targetShopId = ""
		console.log(app.globalData)
		if (app.globalData.targetShopId != "" && app.globalData.targetShopId != null) {
			targetShopId = app.globalData.targetShopId;
		} else {
			targetShopId = app.globalData.openId;
		}
		self.setData({ targetShopId: targetShopId })
		self.loadCategoies();
		self.filterProducts();
		self.setData({ brands: self.filterBrands() });
		self.setData({ items: self.data.brands });
		wx.stopPullDownRefresh()
	}

})