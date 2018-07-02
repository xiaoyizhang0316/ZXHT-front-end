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
    goodsMap: Object,
    animationData: {},
    showModalStatus: false,
    selectedProduct: Object,
    isRecommandChecked: false,
    isHotChecked: false,
	isDiscount: false,
    selectedIndex: 0,
    tmp: { 'price': '', 'vipPrice': '' },
    memo: '',
		myShopProducts : {},
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
    let shopOpenId = app.globalData.openId;
		let url = COM.load('CON').GET_MY_PRODUCTS + shopOpenId;
    COM.load('NetUtil').netUtil(url, "GET", "", (myShopProducts) => {
			wx.setStorage({
								key: "myProducts",
								data: myShopProducts,
							})
      let goodsMap = new Map();		
      if (myShopProducts) {
				for (var x in myShopProducts) {
					let shopProduct = myShopProducts[x];
					goodsMap.set(shopProduct.id,
						{
							"productId": shopProduct.id,
							"title": shopProduct.title,
							"price": shopProduct.nonVipPrice,
							"vip1Price": shopProduct.vip1Price,
							"vip2Price": shopProduct.vip2Price,
							"vip3Price": shopProduct.vip3Price,
							"discountPrice": shopProduct.discountPrice,

							"stock": shopProduct.stock,
							"thumb": COM.load('Util').image(shopProduct.barcode),							
							"openId": shopOpenId,
							
							"barcode": shopProduct.barcode,
							"recommend": shopProduct.recommend,
							"hot": shopProduct.hot,
							"hotSale": shopProduct.hotSale,
							"discount": shopProduct.discount,
							"id" : shopProduct.redis_id
						})
				}
				this.setData({
					goodsLineList: Array.from(goodsMap.values()),
					goodsMap: goodsMap
				})

				// if (!myProducts) {
				// 	//先获得本店的商品目录
				// 	let ids = []
				// 	for (let x in shopProducts) {
				// 		ids.push(shopProducts[x].productId)
				// 	}
				// 	if(ids.length > 0)
				// 	{
				// 		let url = COM.load('CON').GET_MY_PRODUCTS + ids;
				// 		COM.load('NetUtil').netUtil(url, "GET", "", (myProducts) => {
				// 			wx.setStorage({
				// 				key: "myProducts",
				// 				data: myProducts,
				// 			})
				// 			console.log(myProducts)
				// 			for (var x in shopProducts) {
				// 				let shopProduct = shopProducts[x];
				// 				goodsMap.set(shopProduct.productId,
				// 					{
				// 						"productId": shopProduct.productId,
				// 						"title": myProducts[shopProduct.productId].title,
				// 						"price": shopProduct.price,
				// 						"vip1Price": shopProduct.vip1Price,
				// 						"vip2Price": shopProduct.vip2Price,
				// 						"vip3Price": shopProduct.vip3Price,
				// 						// "stock": shopProduct.stock == 0 ? 10 : shopProduct.stock,
				// 						"stock": shopProduct.stock,
				// 						"thumb": COM.load('Util').image(myProducts[shopProduct.productId].barcode),
				// 						"memo": shopProduct.memo,
				// 						"openId": shopOpenId,
				// 						"id": shopProduct.id,
				// 						"barcode": myProducts[shopProduct.productId].barcode,
				// 						"recommend": shopProduct.recommend,
				// 						"hot": shopProduct.hot,
				// 						"hotSale": shopProduct.hotSale
				// 					})
				// 			}
				// 			this.setData({
				// 				goodsLineList: Array.from(goodsMap.values()),
				// 				goodsMap: goodsMap
				// 			})
				// 		});

				// 	}
				// }else{
				

				// }
			
			
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
      isRecommandChecked: this.data.goodsMap.get(e.currentTarget.dataset.id).recommend,
      isHotChecked: this.data.goodsMap.get(e.currentTarget.dataset.id).hot,
	  isDiscount: this.data.goodsMap.get(e.currentTarget.dataset.id).discount
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

  addRecommandation: function (e) {
    this.setData({
      'selectedProduct.recommend': e.detail.value
    })
  },

  addDiscount: function (e) {
	  let self = this
	  this.setData({
		  'selectedProduct.discount': e.detail.value
	  })
	  
	  if (e.detail.value)
	  {
		  let price = self.data.selectedProduct.discountPrice >= 0.1 ? self.data.selectedProduct.discountPrice : self.data.selectedProduct.vip3Price  
		  self.setData({
			  'selectedProduct.discountPrice': price
		  })
	  }
	  console.log(self.data.selectedProduct)
  },
  addHot: function (e) {
    this.setData({
      'selectedProduct.hot': e.detail.value
    })
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
	  let price =e.detail.value;
    if (price >= 0.1 || price == "") {
		this.setData({ 'selectedProduct.price': price });
	} else {
		
		wx.showModal({
			title: '错误',
			content: '青铜会员价格需要大于0.1',
		})
	}
  },

  updateVip1Price: function (e) {
	  let price = e.detail.value;
	  if (price >= 0.1 || price == "") {
		this.setData({ 'selectedProduct.vip1Price': price });
	} else {
		wx.showModal({
			title: '错误',
			content: '白银会员价格需要大于0.1',
		})
	}
  },

  updateVip2Price: function (e) {
	  let price =e.detail.value;
	  if (price >= 0.1 || price == "") {
		this.setData({ 'selectedProduct.vip2Price': price });
	} else {
		wx.showModal({
			title: '错误',
			content: '黄金会员价格需要大于0.1',
		})
	}
  },

  updateVip3Price: function (e) {
	let price = e.detail.value;
	if (price >= 0.1 || price == "") {
		this.setData({ 'selectedProduct.vip3Price': price });
	} else {
		wx.showModal({
			title: '错误',
			content: '钻石会员价格需要大于0.1',
		})
	}
  },
  updateDiscountPrice: function (e) {
	 
	  let price = e.detail.value;
	  if (price >= 0.1 || price == "") {
		  this.setData({ 'selectedProduct.discountPrice': price });
	  }else{
		  wx.showModal({
			  title: '错误',
			  content: '折扣价格需要大于0.1',
		  })
	  }
  },
  updateHotSale: function (e) {
    let quantity = e.detail.value;
    if (quantity > 0) {
      this.setData({
        'selectedProduct.hotSale': quantity
      })
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
	let product = self.data.selectedProduct
	if (product.price && product.vip1Price && product.vip2Price && product.vip3Price)
	{

	}else{
		wx.showModal({
			title: '请检查',
			content: '会员价格设置有误',
			showCancel: false
		})
		return
	}
	if(product.price < 0.1)
	{
		wx.showModal({
			title: '请检查',
			content: '青铜会员价格最低为0.1',
			showCancel:false
		})
		return
	}
	if (product.vip1Price < 0.1) {
		wx.showModal({
			title: '请检查',
			content: '白银会员价格最低为0.1',
			showCancel: false
		})
		return
	}
	if (product.vip2Price < 0.1) {
		wx.showModal({
			title: '请检查',
			content: '黄金会员价格最低为0.1',
			showCancel: false
		})
		return
	}
	if (product.vip3Price < 0.1) {
		wx.showModal({
			title: '请检查',
			content: '钻石会员价格最低为0.1',
			showCancel: false
		})
		return
	}
	if (product.discount && product.discountPrice < 0.1) {
		wx.showModal({
			title: '请检查',
			content: '打折价格最低为0.1',
			showCancel: false
		})
		return
	}
	console.log(self.data.selectedProduct)
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
            goodsMap: self.data.goodsMap,
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
  
  oneButtonProducts:function(){
	wx.navigateTo({
		url: '/page/mine/shop/product/oneButtonProducts/oneButtonProducts',
	})
	
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
    this.filterProducts();
  },

})