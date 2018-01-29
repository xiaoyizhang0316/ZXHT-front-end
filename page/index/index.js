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
    shop: [],
    imgUrls: [
      'https://s18.postimg.org/hbwxwiwmx/image.png',
      'https://s18.postimg.org/v5lalkhih/image.png',
      'https://s18.postimg.org/5zkcept2x/image.png',
      'https://s18.postimg.org/hbwxwih7d/image.png'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    focus: false,
    displayClear: false,
    userinfo: ''

  },

  onLoad: function (options) {
    this.loadRecommendedProducts();
    console.log(this.data)
  },


  onShow: function () {
    setTimeout(function () {
      wx.hideLoading()
    }, 100);
    this.resetSearch();
    this.loadRecommendedProducts();

    //设置页面标题
    let self = this
    var openId = "";
    //let url = "https://a5f93900.ngrok.io/api/mall/shops/openId/" + targetShopId
		
		if (app.globalData.targetShopId != null && app.globalData.targetShopId != "") {
			openId = app.globalData.targetShopId;
			let url = COM.load('CON').getMyShopInfo + targetShopId
			COM.load('NetUtil').netUtil(url, "GET", "", (callbackdata) => {
				if (callbackdata == null) {
				
				} else {
					wx.setNavigationBarTitle({
						title: callbackdata.shopName,
					})
				}
			})
		} else {
			wx.setNavigationBarTitle({
				title: '真享 海淘',
			})
		}
	
  },


  /**
   * load the recomemded products by the shop id
   */
  loadRecommendedProducts: function (event) {
    let self = this
    //如果有targetShopId 则优先展示
    let openId = ""
    if (app.globalData.targetShopId != "") {
      openId = app.globalData.targetShopId;
    } else {
      openId = app.globalData.openId;
    }
    let url = COM.load('CON').SHOP_PRODUCT_URL + "openId/" + openId;
    let products = wx.getStorageSync("products");

    COM.load('NetUtil').netUtil(url, "GET", "", (shopProducts) => {
      if (shopProducts) {
        var shopProductIds = [];
        for (var x in shopProducts) {
          let shopProduct = shopProducts[x];
          shopProductIds.push(shopProduct.productId);
          if (shopProduct.stock >= 0 && shopProduct.price >= 0 && shopProduct.recommend) {
            this.data.goodsList[shopProduct.productId] = {
              "id": shopProduct.productId,
              "title": products[shopProduct.productId].title,
              "price": shopProduct.price,
              "vipPrice": shopProduct.vip1Price,
              "stock": shopProduct.stock,
              //"thumb": COM.load('Util').image(products[shopProduct.productId].barcode),
              "thumb": "https://pic1.zhimg.com/v2-28d55dc8b4c44e5542be2def2ff1d76f_xs.jpg"
            }
          }
          if (shopProduct.stock >= 0 && shopProduct.price >= 0 && shopProduct.hot) {
            this.data.hotList[shopProduct.productId] = {
              "id": shopProduct.productId,
              "title": products[shopProduct.productId].title,
              "price": shopProduct.price,
              "vipPrice": shopProduct.vip1Price,
              "stock": shopProduct.stock,
              //"thumb": COM.load('Util').image(products[shopProduct.productId].barcode),
              "thumb": "https://pic1.zhimg.com/v2-28d55dc8b4c44e5542be2def2ff1d76f_xs.jpg"
            }
          }
        }
        self.setData({
          goodsList: this.data.goodsList,
          hotList: this.data.hotList
        })
        wx.setStorage({
          key: 'shopProductIds',
          data: shopProductIds,
        })
      }
    });
  },

  bindSearch: function (event) {
    wx.navigateTo({
      url: '/page/index/search/search'
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
          content: '扫码失败！',
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
          content: '无法找到该商品 请手动添加！',
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
    return {
      title: '真享海淘',
      desc: '分享的店铺编号是12',
      path: '/page/index/index?shopid=12'
    }
  },

  onReady: function () {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log('index page ready at: ' + timestamp)
  }
})