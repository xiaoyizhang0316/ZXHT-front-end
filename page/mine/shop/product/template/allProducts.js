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
    allGoodsList: [],
    goodsLineList: [],
    brandList: [],
    cateList: [],
    cateListWithId: {},
    myShopProductIds: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    this.listProducts();

    //获得所有品牌
    let allbrands = []
    let brandIds = []
    let urlbrands = COM.load('CON').BRAND_URL + '/all'
    COM.load('NetUtil').netUtil(urlbrands, 'GET', "", brands => {
      for (var x in brands) {
        allbrands.push(brands[x].title)
        brandIds.push(brands[x].id)
      }
      self.setData({
        brandList: allbrands
      });
      wx.setStorage({
        key: 'brandIds',
        data: brandIds,
      })
    });
    //获得所有分类
    let urlcates = COM.load('CON').CATEGORY_URL + 'all'
    let allcategories = []
    let allcategoriesWithId = {}
    COM.load('NetUtil').netUtil(urlcates, 'GET', "", categories => {
      for (var x in categories) {
        allcategories.push(categories[x].name)
        allcategoriesWithId[categories[x].name] = categories[x].id
      };
      self.setData({
        cateList: allcategories,
        cateListWithId: allcategoriesWithId
      });
    });
  },

  listProducts: function () {
    //let shopOpenId = app.globalData.shopOpenId;
    let self = this;
    let products = Object.values(wx.getStorageSync("shopProducts"));
   

    //let shopProductIds = wx.getStorageSync("shopProductIds");
    let url = COM.load('CON').SHOP_PRODUCT_URL + "openId/" + app.globalData.openId;

    COM.load('NetUtil').netUtil(url, "GET", "", (callbackdata) => {
      for (var x in callbackdata) {
        let shopProduct = callbackdata[x];
        self.data.myShopProductIds.push(shopProduct.productId);
      }
      // products.slice(this.data.page * size, ++this.data.page * size).forEach(function (p) {
      // products.slice(this.data.page * size, ++this.data.page * size).forEach(function (p) {
      //   p.thumb = COM.load('Util').image(p.barcode);

      //   p.selected = self.data.myShopProductIds.includes(p.id);
      //   self.data.goodsLineList.push(p);
      // });

      products.slice(0, products.length).forEach(function (p) {
        p.thumb = COM.load('Util').image(p.barcode);
        p.selected = self.data.myShopProductIds.includes(p.id);
        self.data.allGoodsList.push(p);
      });

      this.setData({
        goodsLineList: this.data.allGoodsList,
        allGoodsList: this.data.allGoodsList
      })

    })

  },

  /**
   * 
   */
  switchChange: function (e) {
    let self = this;
    let product = { "openId": app.globalData.openId, "productId": e.currentTarget.dataset.id };
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
      let url = COM.load('CON').ADD_SHOP_PRODUCT_URL;
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
					self.searchByBarcode(COM.load('Util').trim(res.result));
          // console.log(res.result)
          // self.bindSearch(COM.load('Util').trim(res.result));
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

	searchByBarcode: function (barcode) {
		var self = this, item;

		let searchHistoryList = wx.getStorageSync('searchHistoryList');
		if (!searchHistoryList) {
			searchHistoryList = [];
		};

		// console.log(COM.load('CON').BAR_CODE_URL+barcode)

		COM.load('NetUtil').netUtil(COM.load('CON').BAR_CODE_URL + barcode, "GET", "", function (res) {
			item = res;
		
			let searchResult = [];
			if (item) {
				//目前historyList中只存title
				item.thumb = COM.load('Util').image(item.barcode);
				searchResult.push(item);
		
				self.setData({
					displayClear: true,
					searchResult: searchResult
				});

			} else {
				wx.showModal({
					title: '提示',
					content: '无法找到该商品',
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
    console.log(this.data.allGoodsList)
    console.log(this.data.brandList)
    this.setData({
      goodsLineList: this.data.allGoodsList
    })

  },

  bindCateChange: function (e) {
    let self = this
    //goodslinelist是显示的
    let url = COM.load('CON').GET_ALL_PRODUCT_BY_CATEGORYID_URL + self.data.cateListWithId[self.data.cateList[e.detail.value]]
    console.log(url)
    COM.load('NetUtil').netUtil(url, 'GET', "", callback => {
      console.log(callback)
      self.setData({
        goodsLineList: callback
      })
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
  // onShareAppMessage: function () {

  // }
})