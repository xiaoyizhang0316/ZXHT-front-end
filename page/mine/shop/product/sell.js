var app = getApp();
var COM = require('../../../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    displayClear: false,
    goodsLineList: {},
    goodsMap:Object,
    animationData: {},
    showModalStatus: false,
    selectedProduct: Object,
    selectedIndex:0,
    tmp: { 'price': '', 'vipPrice': '' },
    memo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.filterProducts();
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    if (wx.getStorageSync("refreshGoodsList")) {
      this.filterProducts();
      wx.setStorage({
        key: 'refreshGoodsList',
        data: false,
      })
    }
  },

  filterProducts: function () {
    let shopOpenId = app.globalData.shopOpenId;
    let url = COM.load('CON').SHOP_PRODUCT_URL + "openId/" + shopOpenId;
    let products = wx.getStorageSync("products");

    COM.load('NetUtil').netUtil(url, "GET", "", (shopProducts) => {
      let goodsMap = new Map();
      if (shopProducts) {
        for (var x in shopProducts) {
          let shopProduct = shopProducts[x];
          goodsMap.set(shopProduct.productId,
          {
            "productId": shopProduct.productId,
            "title": products[shopProduct.productId].title,
            "price": shopProduct.price,
            "vipPrice": shopProduct.vipPrice,
            "stock": shopProduct.stock == 0 ? 10 : shopProduct.stock,
            "thumb": COM.load('Util').image(products[shopProduct.productId].barcode),
            "memo": shopProduct.memo,
            "openId": shopOpenId,
            "id": shopProduct.id,
            "barcode": products[shopProduct.productId].barcode
          })
        }
        this.setData({
          goodsLineList: Array.from(goodsMap.values()),
          goodsMap: goodsMap
        })
      }
    });
  },

  resetDisplay: function (e) {
    this.setData({
      goodsLineList: Array.from(this.data.goodsMap.values()),
    })
  },

  listProdsTemplate: function (event) {
    wx.navigateTo({
      url: './template/allProducts'
    })
  },

  //搜索事件
  bindSearch: function (e) {
    var query = e;
    if (e instanceof Object) {
      query = e.detail.value;
    }
    if (query.length === 0) {
      this.resetSearch();
    } else {
      let tmp = {};
      let goodsList = Array.from(this.data.goodsMap.values());
      for (let i in goodsList) {
        if (e instanceof Object) {
          if (goodsList[i].title.toLowerCase().indexOf(query.toLowerCase()) > -1) {
            tmp[i] = goodsList[i]
          }
        } else {
          if (goodsList[i].barcode == query) {
            tmp[i] = goodsList[i];
            break;
          }
        }
      }

      this.setData({
        search: query,
        displayClear: true,
        goodsLineList: tmp
      });
    }
  },

  //二维码搜索
  scanCode() {
    let self = this;
    wx.scanCode({
      success: (res) => {
        if (res.result) {
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

  //重置搜索栏
  resetSearch: function (e) {
    this.setData({ search: '', displayClear: false });
    this.resetDisplay();
  },

  // 显示遮罩层
  showModal: function (e) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      selectedProduct: this.data.goodsMap.get(e.currentTarget.dataset.id),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  increaseStock: function (e) {
    let stock = e.currentTarget.dataset.stock;
    if (stock < 1000) {
      this.setData({ 'selectedProduct.stock': ++stock });
    }
  },

  decreaseStock: function (e) {
    let stock = e.currentTarget.dataset.stock;
    if (stock > 0) {
      this.setData({ 'selectedProduct.stock': --stock });
    }
  },

  updateStock: function (e) {
    let stock = e.detail.value;
    if (stock >= 0) {
      this.setData({ 'selectedProduct.stock': stock });
    }
  },

  updatePrice: function (e) {
    let price = e.detail.value;
    if (price > 0.1) {
      this.setData({ 'tmp.price': price });
    }
  },

  updateVipPrice: function (e) {
    let price = e.detail.value;
    if (price > 0.1) {
      this.setData({ 'tmp.vipPrice': price });
    }
  },

  bindExtra: function () {
    wx.navigateTo({
      url: "/page/common/templates/textArea/textArea?content=" + this.data.memo
    })
  },



  saveShopProduct: function () {
    let self = this, url = COM.load('CON').SHOP_PRODUCT_URL + '/saveOrUpdate';
    if (self.data.tmp && self.data.tmp.price) {
      self.setData({ 'selectedProduct.price': self.data.tmp.price });
    }
    if (self.data.tmp && self.data.tmp.vipPrice) {
      self.setData({ 'selectedProduct.vipPrice': self.data.tmp.vipPrice });
    }

    COM.load('NetUtil').netUtil(url, 'POST', self.data.selectedProduct, function (res) {
      wx.showToast({
        title: '数据更新成功',
        success: function () {
          self.data.goodsMap.set(self.data.selectedProduct.productId, self.data.selectedProduct);
          for (let x in self.data.goodsLineList) {
            if (self.data.goodsLineList[x].productId == self.data.selectedProduct.productId) {
              self.data.goodsLineList[x] = self.data.selectedProduct;
              break;
            }
          }
          self.setData({
            goodsLineList: self.data.goodsLineList,
            goodsMap : self.data.goodsMap,
            tmp: Object
          });

          self.hideModal();
        }
      })
    })
  },

  priceValidation: function () {
    let self = this, tmpProduct = this.data.tmp;
    let price = tmpProduct.price ? tmpProduct.price : this.data.selectedProduct.price;
    let vipPrice = tmpProduct.vipPrice ? tmpProduct.vipPrice : this.data.selectedProduct.vipPrice;
    if (parseFloat(price) < parseFloat(vipPrice)) {
      wx.showModal({
        title: '提示',
        content: '确定会员价大于普通价?',
        success: function (res) {
          if (res.confirm) {
            self.saveShopProduct();
          }
        }
      })
    } else {
      self.saveShopProduct();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

})