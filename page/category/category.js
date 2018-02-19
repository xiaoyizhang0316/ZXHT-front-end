var app = getApp();
var COM = require('../../utils/common.js');
Page({
  data: {
    res:{},
    leftCategory: [
      { name: '所有品牌', ename: 'brands', banner: '/image/c1.png' },
    ],
    rightCategory:[],
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
  },

  onLoad: function (options) {
    this.loadCategoies();
    this.setData({ brands: this.filterBrands(), products: this.filterProducts() });
    this.setData({ items: this.data.brands });
  },

  loadCategoies: function() {
    let self = this;
		//如果有targetShopId 则优先展示
		let openId = ""
		if (app.globalData.targetShopId != "") {
			openId = app.globalData.targetShopId;
		} else {
			openId = app.globalData.openId;
		}
    COM.load('NetUtil').netUtil(COM.load('CON').CATEGORY_URL + "openId/" + openId, "GET", "", function (res) {
      console.log(res)
        for(var x in res) {
          var cat = {
            name: res[x].name, 
            ename: res[x].id, 
            banner: '/image/c1.png'
          }
          self.data.leftCategory.push(cat);
        }
        self.setData({ res: res, leftCategory: self.data.leftCategory});
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
  //   let products = wx.getStorageSync("products");
  //   let shopProductIds = wx.getStorageSync("shopProductIds");
  //   for (var x in shopProductIds) {
  //     shopBrands.add(brands[products[shopProductIds[x]].brand]);
  //   }

  //   return Array.from(shopBrands);
  // },
  
  filterBrands: function () {
    let shopBrands = new Set();
    let brands = wx.getStorageSync("brands");
    let products = wx.getStorageSync("products");
    let shopProductIds = wx.getStorageSync("shopProductIds");
    for (var x in shopProductIds) {
      shopBrands.add(brands[products[shopProductIds[x]].brand]);
    }
    console.log(shopBrands);

    return Array.from(shopBrands);
  },

  filterProducts: function () {
    let productsMap = new Map();
    let products = wx.getStorageSync("products");
    let shopProductIds = wx.getStorageSync("shopProductIds");
    for (var x in shopProductIds) {
      let key = products[shopProductIds[x]].category;
      let list = productsMap.get(key) ? productsMap.get(key) : [];
      list.push(products[shopProductIds[x]]);
      productsMap.set(key, list);
    }

    //key是undefined ???
    return productsMap;
    console.log(productsMap)
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
      console.log(self.data)
      console.log(this.data)
      this.setData({ items: this.data.brands, rightCategory: [this.data.brands] });
      console.log(this.data.brands)
    } else {
      let subCategories = this.data.res[e.target.dataset.index - 1].subCategories;
      let rightCategory = [];

      let products = wx.getStorageSync("products");
      subCategories.forEach(function(subCat) {
        subCat.productIds.forEach(function (val, index, arr) {
          var id = (typeof val == 'object')? val.id:val
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

  }

})