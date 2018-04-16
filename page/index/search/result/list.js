var app = getApp();
// var NetUtil = require('../../../../utils/netUtil.js')
// var Util = require('../../../../utils/util.js')
// var CON = require('../../../../utils/constant.js')

var COM = require('../../../../utils/common.js')

Page({
  data: {
    goodsList: {},
    ids: [],
  },

  onLoad: function (options) {
    this.setData({ ids: options.ids});
    this.loadPrice();
  },

  filterProductsIds: function (ids) {  
    let searchProducts = [];
    let products = wx.getStorageSync("shopProducts");
    for (var x in ids) {
      searchProducts.push(products[ids[x]]);
      }
    return searchProducts;
  },

  loadPrice: function () {
    let shopOpenId = app.globalData.shopOpenId;
    let url = COM.load('CON').SHOP_PRODUCT_URL + "/selected/" + shopOpenId + "/" + this.data.ids;
    let products = wx.getStorageSync("shopProducts");

    COM.load('NetUtil').netUtil(url, "GET", "", (shopProducts) => {
      if (shopProducts) {
        for (var x in shopProducts) {
          let shopProduct = shopProducts[x];
          if (shopProduct) {
            this.data.goodsList[shopProduct.productId] = {
              "id": shopProduct.productId,
              "title": products[shopProduct.productId].title,
              "price": shopProduct.vipPrice,
              "stock": shopProduct.stock,
              "thumb": COM.load('Util').image(products[shopProduct.productId].thumb),
            }
        }
        }
        this.setData({ goodsList: this.data.goodsList })
      }
    });
  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})