var app = getApp();
var COM = require('../../../../../utils/common.js')

const size = 20;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    displayClear: false,
    searchResult: [],
    lastQuery: '',//最后一个查询的关键词
    page: 0,
    goodsLineList: [],
    brandList: ['品牌1', '品牌2', '品牌3', '品牌4'],
    cateList: ['分类1', '分类2', '分类3', '分类4']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    this.listProducts();

    //获得所有品牌
    let allbrands = []
    let urlbrands = COM.load('CON').BRAND_URL + '/all'
    COM.load('NetUtil').netUtil(urlbrands, 'GET', "", brands => {
      for (var x in brands) {
        allbrands.push(brands[x].title)
      }
      self.setData({
        brandList: allbrands
      });
    });
    //获得所有分类
    let urlcates = COM.load('CON').CATEGORY_URL + '/all'
    let allcategories = []
    COM.load('NetUtil').netUtil(urlcates, 'GET', "", categories => {
      for (var x in categories) {
        allcategories.push(categories[x].name);
      };
      self.setData({
        cateList: allcategories
      });
    });
  },

  listProducts: function () {
    //let shopOpenId = app.globalData.shopOpenId;
    let self = this;
    let products = Object.values(wx.getStorageSync("products"));
    let shopProductIds = wx.getStorageSync("shopProductIds");
    products.slice(this.data.page * size, ++this.data.page * size).forEach(function (p) {
      p.thumb = COM.load('Util').image(p.barcode);
      p.selected = shopProductIds.includes(p.id);
      self.data.goodsLineList.push(p);
    });

    this.setData({
      page: this.data.page, goodsLineList: this.data.goodsLineList
    })
  },

  /**
   * 
   */
  switchChange: function (e) {
    let self = this;
    let product = { "openId": app.globalData.shopOpenId, "productId": e.currentTarget.dataset.id };
    if (!e.detail.value) {
      wx.showModal({
        title: '提示',
        content: '确定下架该商品?',
        success: function (res) {
          if (res.confirm) {
            let url = COM.load('CON').SHOP_PRODUCT_URL;
            COM.load('NetUtil').netUtil(url, 'DELETE', product, function (res) {
              let shopProductIds = wx.getStorageSync("shopProductIds");
              shopProductIds = shopProductIds.filter(o => o != e.currentTarget.dataset.id),
                wx.setStorage({
                  key: 'shopProductIds',
                  data: shopProductIds,
                  success: function () {
                    for (let i = 0; i < self.data.goodsLineList.length; i++) {
                      if (self.data.goodsLineList[i].id == e.currentTarget.dataset.id) {
                        self.data.goodsLineList[i].selected = false;
                      }
                    }
                    for (let i = 0; i < self.data.searchResult.length; i++) {
                      if (self.data.searchResult[i].id == e.currentTarget.dataset.id) {
                        self.data.searchResult[i].selected = false;
                      }
                    }
                    // self.data.goodsLineList[e.currentTarget.dataset.id - 1].selected = false;
                    // self.data.searchResult[e.currentTarget.dataset.id - 1].selected = false;
                    self.setData({
                      goodsLineList: self.data.goodsLineList,
                      searchResult: self.data.searchResult
                    });
                  }
                })
            })
          } else if (res.cancel) {
            self.setData({ goodsLineList: self.data.goodsLineList });
          }
        }
      })
    } else {
      //上架商品
      let url = COM.load('CON').SHOP_PRODUCT_URL + '/saveOrUpdate';
      COM.load('NetUtil').netUtil(url, 'POST', product, function (res) {
        let shopProductIds = wx.getStorageSync("shopProductIds");
        if (!shopProductIds.includes(product.productId)) {
          shopProductIds.push(product.productId);
          wx.setStorage({
            key: 'shopProductIds',
            data: shopProductIds,
            success: function () {
              for (let i = 0; i < self.data.goodsLineList.length; i++) {
                if (self.data.goodsLineList[i].id == e.currentTarget.dataset.id) {
                  self.data.goodsLineList[i].selected = true;
                }
              }
              for (let i = 0; i < self.data.searchResult.length; i++) {
                if (self.data.searchResult[i].id == e.currentTarget.dataset.id) {
                  self.data.searchResult[i].selected = true;
                }
              }
              // self.data.goodsLineList[e.currentTarget.dataset.id -1].selected = true;
              // self.data.searchResult[e.currentTarget.dataset.id - 1].selected = true;
              self.setData({
                goodsLineList: self.data.goodsLineList,
                searchResult: self.data.searchResult
              });
            }
          })
        }
      })
    };
    //once something changed should force refresh goods list page
    wx.setStorage({
      key: 'refreshGoodsList',
      data: true,
    })
  },


  //二维码搜索
  scanCode() {
    let self = this;
    wx.scanCode({
      success: (res) => {
        if (res.result) {
          console.log(res.result)
          self.bindSearch(COM.load('Util').trim(res.result));
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
      }
    })
  },


  /**
   * search the product
   */
  bindSearch: function (e) {
    var query = e;
    if (e instanceof Object) {
      query = e.detail.value
    }

    this.setData({
      lastQuery: query
    });

    this.updateSearchResult()

  },

  /**
   * update searchResult
   */
  updateSearchResult: function (e) {
    var query = this.data.lastQuery, self = this;
    if (query.length === 0) {
      return false;
    } else {
      let shopProductIds = wx.getStorageSync("shopProductIds");
      let url = COM.load('CON').PRODUCT_URL + '/title/';
      let searchResult = [];
      COM.load('NetUtil').netUtil(url + query, 'GET', "", function (res) {
        res.forEach(function (p) {
          p.thumb = COM.load('Util').image(p.barcode);
          p.selected = shopProductIds.includes(p.id);
          searchResult.push(p);
        });
        self.setData({
          displayClear: true,
          searchResult: searchResult
        });
      });
    }
  },

  resetSearch: function (e) {
    this.setData({ search: '', displayClear: false })
  },

  bindBrandChange: function (e) {
    console.log(e.detail)
    console.log(this.data.goodsLineList)
  },

  goodsByBrands: function(brandId){
    goodsList = []
    goodsList

    return 
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
    this.listProducts();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})