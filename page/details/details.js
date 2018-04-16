var app = getApp();
// var NetUtil = require('../../utils/netUtil.js')
// var Util = require('../../utils/util.js')
// var CON = require('../../utils/constant.js')

var COM = require('../../utils/common.js')

Page({
  data:{
    cartList: [],
    //要添加到购物车里的商品项
    newCartItem: {
      id: 0, 
      title: '', 
      image: '', 
      num: 0, 
      price: 0.0, 
      selected: true
    },
    goods: {
      id: 1,
      thumb: '',
      title: '',
      price: 0,
			
      stock: '无货',
      detail: '',
      parameter: '规格:无',
      service: '不支持退货'
    },
    detail: {},
    num: 1,
    numInCart: 0,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    productId:'',
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },

  addToCart() {
    const self = this;
    console.log(self.data.numInCart)
    
    //todo check stock
    if (self.data.goods.stock == '没货'){
      console.log('没货')
      return false;
    } else if (self.data.num + self.data.numInCart > self.data.goods.stock){

      console.log('库存不足')
      return false;
    }

    var newCartItem = self.data.newCartItem
    newCartItem.id = self.data.goods.id
    newCartItem.title = self.data.goods.title
    newCartItem.image = self.data.goods.thumb
    newCartItem.num = self.data.num
    newCartItem.price = self.data.goods.price
    // newCartItem.selected: true

    self.addCartItemToStorage(newCartItem)

  },

  addCartItemToStorage(item) {
		console.log(item)
    const self = this;
    if (self.data.cartList.length > 0){

      var flag = false;
      for (var x in self.data.cartList) {
        if (self.data.cartList[x].id == item.id) {
          flag = true

          self.data.cartList[x].num += item.num
          self.setData({
            cartList: self.data.cartList,
          })
          break;
        }
      }

      if (!flag) {
        self.data.cartList.push(item)
        self.setData({
          cartList: self.data.cartList
        })
      }
    }else{
      self.data.cartList.push(item)
      self.setData({
        cartList: self.data.cartList
      })
    }

    wx.setStorage({
      key: "cartList",
      data: self.data.cartList,
      success: function (res) {
        const num = self.data.num;
        let total = self.data.totalNum;
        let numInCartOld = self.data.numInCart;
        //动画效果
        self.setData({
          show: true
        })
        setTimeout(function () {
          self.setData({
            show: false,
            scaleCart: true
          })
          setTimeout(function () {
            self.setData({
              scaleCart: false,
              hasCarts: true,
              totalNum: num + total,//新增+已有
              numInCart: num + numInCartOld
            })
          }, 200)
        }, 300)
      },
      fail:function(){
        console.log('add item to cart failed')
      } 
    })

  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },

  //获取该商品在购物车中的数目
  updateTotalNum(){
    var self = this
    wx.getStorage({
      key: 'cartList',
      success: function (res) {
        if (res.data.length > 0) {

          var totalNum = 0;
          var numInCart = 0;
          for (var x in res.data) {
            if (res.data[x].id == self.data.goods.id) {
              numInCart += res.data[x].num
            }
            totalNum += res.data[x].num
          }

          self.setData({
            totalNum: totalNum,
            numInCart: numInCart,
            cartList: res.data,
            hasCarts: true,
          })

        } else {
          self.setData({
            cartList: [],
            totalNum: 0,
            hasCarts: false,
          })
        }
      },
    })
  },
  /**
   * 加载商品基本信息
   */
  onLoad: function (options) {
		this.setData({ productId: options.id });
		//如果是分享的页面
		if (Object.prototype.toString.call(options) !== '[object Undefined]' && Object.prototype.toString.call(options.targetShopId) !== '[object Undefined]') {
			let openId = app.globalData.openId
			let targetShopId = options.targetShopId
			let productId = options.id
			//检查当前用户是否可以进入目标店铺

			let url = COM.load('CON').APPLY_TO_SHOP;
			COM.load('NetUtil').netUtil(url, "POST", { "open_id": openId, "shop_id": targetShopId }, (callback) => {
			
				if (callback == false) {
					wx.showModal({
						title: '提示',
						content: '您暂时无法购买此店铺的商品，我们已经为您向店主申请进入, 请等待店主审核后方可进店购物, 点击确认进入展厅',
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定')
								wx.navigateTo({
									url: '/page/welcome/welcome?targetShopId=o0_gG0RDvF6ESSQSFZJKuOyB2bDE',
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
								wx.navigateBack({
									delta: -1
								})
							}
						}
					})
				} else {
					//将得到的shopid 写入缓存并改写global shopid
					wx.setStorage({
						key: 'targetShopId',
						data: targetShopId,
					})
					app.globalData.targetShopId = targetShopId
				}
			})
			
		} 
		
  },


/**
 * 加载相应店铺的商品价格和库存
 */
  onShow: function () {
		let self = this
		//需要取得本店对于本位客人的价格信息
		let url = ""
		let productId = self.data.productId
		if (app.globalData.targetShopId != "" && app.globalData.targetShopId != null) {
			url = COM.load('CON').TARGETSHOP_PRODUCT_URL + "/" + app.globalData.openId + "/" + app.globalData.targetShopId + "/" + productId
		} else {
			url = COM.load('CON').TARGETSHOP_PRODUCT_URL + "/" + app.globalData.openId + "/" + app.globalData.openId + "/" + productId
		}

		COM.load('NetUtil').netUtil(url, "GET", "", (shopProduct) => {
			if (shopProduct) {
				let products = wx.getStorageSync("shopProducts");
				if (products) {
					self.data.goods["id"] = productId;
					self.data.goods["title"] = products[productId].title;
					self.data.goods["thumb"] = COM.load('Util').image(products[productId].barcode);
					self.data.goods["stock"] = shopProduct.stock;
					self.data.goods["price"] = shopProduct.price;

					// http://101.178.98.25:8443/api/mall/products/242
					let detailUrl = COM.load('CON').PRODUCT_URL + productId;
					COM.load('NetUtil').netUtil(detailUrl, "GET", "", (detail) => {
						if (detail) {

							self.setData({
								detail: detail
							})
						}
					});

					self.setData({
						goods: self.data.goods
					})

					self.updateTotalNum();
				}
			}
		});
   
  },
	onShareAppMessage: function(){
		let self = this
		let openId = app.globalData.openId;
		let shopId = (app.globalData.targetShopId != "" && app.globalData.targetShopId != null) ? app.globalData.targetShopId : app.globalData.openId
		
		return {
			title: '真实澳洲直邮 朋友分享的海淘',
			desc: self.data.goods["title"],
			path: '/page/details/details?id='+self.data.productId+'&targetShopId='+shopId,
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	}

    
})