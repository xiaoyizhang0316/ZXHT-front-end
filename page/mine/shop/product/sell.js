var app = getApp();
var COM = require('../../../../utils/common.js');
var util = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    displayClear: false,
    goodsLineList: {},
    goodsMap: Object,
    animationData: {},
    showModalStatus: false,
    selectedProduct: Object,
    isRecommandChecked: false,
    isHotChecked: false,
    isDiscount: false,
    selectedIndex: 0,
    isGroup: false,
    tmp: {
      'price': '',
      'vipPrice': ''
    },
    memo: '',
    myShopProducts: {},

    recommendationList: {},
    recommendationAddList: [],
    recommendationModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //this.filterProducts();
    var time = new Date();
    time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      date: time,
      today: time,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // if (wx.getStorageSync("refreshGoodsList")) {
    //   this.filterProducts();
    //   wx.setStorage({
    //     key: 'refreshGoodsList',
    //     data: false,
    //   })
    // }
    this.filterProducts();

  },

  filterProducts: function() {
    let self = this
    let shopOpenId = app.globalData.openId;
    let url = COM.load('CON').GET_MY_PRODUCTS_AND_RECOMMENDATION + shopOpenId;
    COM.load('NetUtil').netUtil(url, "GET", "", (res) => {
      console.log(res)
      wx.setStorage({
        key: "myProducts",
        data: res.myShopProducts,
      })
      let myShopProducts = res.myShopProducts
      let last_recommendation = 0
      try {
        last_recommendation = wx.getStorageSync("recommendation");

      } catch (e) {
        wx.setStorageSync("recommendation", +new Date)
      }

      let current = +new Date
      console.log(current)
      console.log(last_recommendation)
      console.log(res.recommendation)
      if ((current - last_recommendation) > 60 * 60 * 24 * 1000 && res.recommendation == true) {
        wx.setStorageSync("recommendation", +new Date)
        for (var x in res.recommendationList) {
          let r = res.recommendationList[x];
          res.recommendationList[x].thumb = COM.load('Util').imageThumb(r.barcode)
          res.recommendationList[x].selected = false
        }
        self.setData({
          recommendationList: res.recommendationList,
          recommendationModal: true
        })

      }
      let goodsMap = new Map();
      if (myShopProducts) {
        for (var x in myShopProducts) {
          let shopProduct = myShopProducts[x];
          goodsMap.set(shopProduct.id, {
            "productId": shopProduct.id,
            "title": shopProduct.title,
            "price": shopProduct.nonVipPrice,
            "vip1Price": shopProduct.vip1Price,
            "vip2Price": shopProduct.vip2Price,
            "vip3Price": shopProduct.vip3Price,
            "discountPrice": shopProduct.discountPrice,
            "stock": shopProduct.stock,
            "thumb": COM.load('Util').imageThumb(shopProduct.barcode),
            "openId": shopOpenId,
            "barcode": shopProduct.barcode,
            "recommend": shopProduct.recommend,
            "hot": shopProduct.hot,
            "hotSale": shopProduct.hotSale,
            "discount": shopProduct.discount,
            "id": shopProduct.redis_id,
            "group": shopProduct.group,
            "groupPrice": shopProduct.groupPrice,
            "groupNumber": shopProduct.groupNumber,
          })
        }
        this.setData({
          goodsLineList: Array.from(goodsMap.values()),
          goodsMap: goodsMap
        })

      }
    });
  },

  resetDisplay: function(e) {
    this.setData({
      goodsLineList: Array.from(this.data.goodsMap.values()),
    })
  },

  listProdsTemplate: function(event) {
    wx.navigateTo({
      url: './template/allProducts'
    })
  },

  //搜索事件
  bindSearch: function(e) {
    var query = e;
    console.log(e);
    if (e instanceof Object) {
      query = e.detail.value;
      query = query.replace(/’|‘/g, "'");
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

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
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
            success: function(res) {
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
  resetSearch: function(e) {
    this.setData({
      search: '',
      displayClear: false
    });
    this.resetDisplay();
  },

  // 显示遮罩层
  showModal: function(e, m = "showModalStatus") {
    console.log(m)
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    if (m == "showModalStatus") {
      this.setData({
        selectedProduct: this.data.goodsMap.get(e.currentTarget.dataset.id),
        isRecommandChecked: this.data.goodsMap.get(e.currentTarget.dataset.id).recommend,
        isHotChecked: this.data.goodsMap.get(e.currentTarget.dataset.id).hot,
        isDiscount: this.data.goodsMap.get(e.currentTarget.dataset.id).discount,
        isGroup: this.data.goodsMap.get(e.currentTarget.dataset.id).group,
      })
    }
    this.setData({
      animationData: animation.export(),
      [m]: true,
    })


    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  // 隐藏遮罩层
  hideModal: function(e) {
    console.log(e)
    let m = "showModalStatus"
    if (Object.prototype.toString.call(e) !== '[object Undefined]' && e.currentTarget.dataset.name == 'recommendationModal') {
      m = 'recommendationModal'
      this.setData({
        recommendation: true
      })
    }
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        [m]: false
      })
    }.bind(this), 200)
  },
  deleteShopProduct: function(e) {
    let self = this
    let productId = e.currentTarget.dataset.id;
    let shopId = app.globalData.openId;
    let product = {
      "openId": app.globalData.openId,
      "productId": productId
    };
    wx.showModal({
      title: '提示',
      content: '确认下架本商品么?',
      success: function(e) {
        if (e.confirm) {
          let url = COM.load('CON').SHOP_PRODUCT_URL;
          COM.load('NetUtil').netUtil(url, "DELETE", product, (flag) => {
            if (flag == true) {

              self.onShow();

            } else {
              wx.showModal({
                title: '提示',
                content: '已有未完成的订单包含此商品,请完成订单后重试',
              })
            }

          })

        }


      }
    })


  },

  addRecommandation: function(e) {
    this.setData({
      'selectedProduct.recommend': e.detail.value
    })
  },


  addDiscount: function(e) {
    let self = this
    this.setData({
      'selectedProduct.discount': e.detail.value
    })

    if (e.detail.value) {
      let price = self.data.selectedProduct.discountPrice >= 0.1 ? self.data.selectedProduct.discountPrice : self.data.selectedProduct.vip3Price
      self.setData({
        'selectedProduct.discountPrice': price
      })
    }
    console.log(self.data.selectedProduct)
  },
  addHot: function(e) {
    this.setData({
      'selectedProduct.hot': e.detail.value
    })
  },

  addGroup: function(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value);
    this.setData({
      'selectedProduct.group': e.detail.value,
      'isGroup' : e.detail.value
    })
  },

  updateGroupPrice: function(e) {
    let price = e.detail.value;
    let self = this
    if (price.toString().match(/^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/) && price >= 0.1) {
      this.setData({
        'selectedProduct.groupPrice': price
      });

    } else {

      wx.showModal({
        title: '错误',
        content: '拼团价格格式有误，或者价格不大于0.1',
      })
    }
  },
  updateGroupNumber: function(e) {
    let groupNumber = e.detail.value;
    let self = this
    if (groupNumber.toString().match(/^[1-9]\d*$/) && groupNumber >= 1) {
      this.setData({
        'selectedProduct.groupNumber': groupNumber
      });

    } else {

      wx.showModal({
        title: '错误',
        content: '拼团人数格式有误',
      })
    }
  },
  increaseStock: function(e) {
    let stock = e.currentTarget.dataset.stock;
    if (stock < 1000) {
      this.setData({
        'selectedProduct.stock': ++stock
      });
    }
  },

  decreaseStock: function(e) {
    let stock = e.currentTarget.dataset.stock;
    if (stock > 0) {
      this.setData({
        'selectedProduct.stock': --stock
      });
    }
  },

  updateStock: function(e) {
    let stock = e.detail.value;
    if (stock >= 0) {
      this.setData({
        'selectedProduct.stock': stock
      });
    }
  },

  updatePrice: function(e) {
    let price = e.detail.value;
    let self = this
    if (price.toString().match(/^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/) && price >= 0.1) {
      this.setData({
        'selectedProduct.price': price
      });

    } else {

      wx.showModal({
        title: '错误',
        content: '青铜会员价格格式有误，或者价格不大于0.1',
      })
    }
  },

  updateVip1Price: function(e) {
    let price = e.detail.value;
    if (price.toString().match(/^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/) && price >= 0.1) {
      this.setData({
        'selectedProduct.vip1Price': price
      });
    } else {
      wx.showModal({
        title: '错误',
        content: '白银会员价格格式有误，或者价格不大于0.1',
      })
    }
  },

  updateVip2Price: function(e) {
    let price = e.detail.value;
    if (price.toString().match(/^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/) && price >= 0.1) {
      this.setData({
        'selectedProduct.vip2Price': price
      });
    } else {
      wx.showModal({
        title: '错误',
        content: '黄金会员价格格式有误，或者价格不大于0.1',
      })
    }
  },

  updateVip3Price: function(e) {
    let price = e.detail.value;
    if (price.toString().match(/^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/) && price >= 0.1) {
      this.setData({
        'selectedProduct.vip3Price': price
      });
    } else {
      wx.showModal({
        title: '错误',
        content: '商铺代理价格格式有误，或者价格不大于0.1',
      })
    }
  },
  updateDiscountPrice: function(e) {

    let price = e.detail.value;
    if (price.toString().match(/^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/) && price >= 0.1) {
      this.setData({
        'selectedProduct.discountPrice': price
      });
    } else {
      wx.showModal({
        title: '错误',
        content: '折扣价格格式有误，或者价格不大于0.1',
      })
    }
  },
  updateHotSale: function(e) {
    let quantity = e.detail.value;
    if (quantity > 0) {
      this.setData({
        'selectedProduct.hotSale': quantity
      })
    }
  },

  bindExtra: function() {
    wx.navigateTo({
      url: "/page/common/templates/textArea/textArea?content=" + this.data.memo
    })
  },



  saveShopProduct: function() {
    let self = this,
      url = COM.load('CON').SHOP_PRODUCT_URL + '/saveOrUpdate';
    if (self.data.tmp && self.data.tmp.price) {
      self.setData({
        'selectedProduct.price': self.data.tmp.price
      });
    }
    if (self.data.tmp && self.data.tmp.vipPrice) {
      self.setData({
        'selectedProduct.vipPrice': self.data.tmp.vipPrice
      });
    }
    let product = self.data.selectedProduct
    if (product.price && product.vip1Price && product.vip2Price && product.vip3Price) {

    } else {
      wx.showModal({
        title: '请检查',
        content: '会员价格设置有误',
        showCancel: false
      })
      return
    }
    let originalProduct = self.data.goodsMap.get(product.productId)
    if (originalProduct.price != product.price) {
      let myShopInfo = wx.getStorageSync('myShopInfo')
      let price = product.price
      wx.showModal({
        title: '青铜价格变更',
        content: "是否根据店铺折扣改变本商品其他的会员价格?\r\n 白银: " + myShopInfo.vip1 * 100 + "折, 黄金: " + myShopInfo.vip2 * 100 + "折, 代理: " + myShopInfo.vip3 * 100 + "折",
        success: function(res) {
          if (res.confirm) {

            let vip1Price = Math.round((price * 10000 * myShopInfo.vip1) / 100) / 100
            let vip2Price = Math.round((price * 10000 * myShopInfo.vip2) / 100) / 100
            let vip3Price = Math.round((price * 10000 * myShopInfo.vip3) / 100) / 100
            self.setData({

              'selectedProduct.vip1Price': vip1Price,
              'selectedProduct.vip2Price': vip2Price,
              'selectedProduct.vip3Price': vip3Price,
            });

          } else if (res.cancel) {

          }
          COM.load('NetUtil').netUtil(url, 'POST', self.data.selectedProduct, function(res) {
            wx.showToast({
              title: '数据更新成功',
              success: function() {
                self.data.goodsMap.set(self.data.selectedProduct.productId, self.data.selectedProduct);
                for (let x in self.data.goodsLineList) {
                  if (self.data.goodsLineList[x].productId == self.data.selectedProduct.productId) {
                    self.data.goodsLineList[x] = self.data.selectedProduct;
                    break;
                  }
                }
                self.setData({
                  goodsLineList: self.data.goodsLineList,
                  goodsMap: self.data.goodsMap,
                  tmp: Object
                });

                self.hideModal();
              }
            })
          })
        }
      })
    } else {
      COM.load('NetUtil').netUtil(url, 'POST', self.data.selectedProduct, function(res) {
        wx.showToast({
          title: '数据更新成功',
          success: function() {
            self.data.goodsMap.set(self.data.selectedProduct.productId, self.data.selectedProduct);
            for (let x in self.data.goodsLineList) {
              if (self.data.goodsLineList[x].productId == self.data.selectedProduct.productId) {
                self.data.goodsLineList[x] = self.data.selectedProduct;
                break;
              }
            }
            self.setData({
              goodsLineList: self.data.goodsLineList,
              goodsMap: self.data.goodsMap,
              tmp: Object
            });

            self.hideModal();
          }
        })
      })
    }

  },

  priceValidation: function() {
    let self = this,
      tmpProduct = this.data.tmp;
    let price = tmpProduct.price ? tmpProduct.price : this.data.selectedProduct.price;
    let vipPrice = tmpProduct.vipPrice ? tmpProduct.vipPrice : this.data.selectedProduct.vipPrice;
    if (parseFloat(price) < parseFloat(vipPrice)) {
      wx.showModal({
        title: '提示',
        content: '确定会员价大于普通价?',
        success: function(res) {
          if (res.confirm) {
            self.saveShopProduct();
          }
        }
      })
    } else {
      self.saveShopProduct();
    }
  },

  switchChangeRecommendationList: function(e) {
    let self = this
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let array = self.data.recommendationAddList
    const index = array.indexOf(id);

    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(id)
    }

    self.setData({
      recommendationAddList: array
    })
    console.log(self.data.recommendationAddList)
  },
  oneButtonProducts: function() {
    wx.navigateTo({
      url: '/page/mine/shop/product/oneButtonProducts/oneButtonProducts',
    })

  },
  saveRecommendationAddList: function(e) {
    let self = this
    let array = self.data.recommendationAddList
    let params = {
      "recommendationArray": JSON.stringify(array),
      "openId": app.globalData.openId,
    }
    let url = COM.load('CON').ADD_RECOMMENDATIONLIST;
    COM.load('NetUtil').netUtil(url, "POST", params, (res) => {
      if (res == true) {
        wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel: false,
          success: function(e) {

            self.setData({
              recommendationModal: false,
              recommendation: true
            })

            self.onShow()

          }
        })

      }
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    //this.filterProducts();
  },

})