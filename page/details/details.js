 var app = getApp();
// var NetUtil = require('../../utils/netUtil.js')
// var Util = require('../../utils/util.js')
// var CON = require('../../utils/constant.js')

var COM = require('../../utils/common.js')

Page({
    data: {
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
            basePrice: 0,
            stock: '无货',
            detail: '',
            parameter: '规格:无',
            service: '不支持退货',
            images: []
        },
        detail: {},
        num: 1,
        numInCart: 0,
        totalNum: 0,
        hasCarts: false,
        curIndex: 0,
        show: false,
        scaleCart: false,
        productId: '',
        img_base: COM.load('CON').IMG_BASE,
        showModel: false,
        specialPrices: [],
        hasComments: false,
        comments: [],
        groupInfo: {},
        groupList:[],
        openId : ""
    },

    addCount() {
        let num = this.data.num;
        num++;
        this.setData({
            num: num
        })
    },

    addToCart() {
        const self = this;
        console.log(self.data.numInCart)
        if (self.data.goods.price == 0) {
            return;
        }
        //todo check stock
        if (self.data.goods.stock == '没货') {
            console.log('没货')
            return false;
        } else if (self.data.num + self.data.numInCart > self.data.goods.stock) {

            console.log('库存不足')
            return false;
        }

        var newCartItem = self.data.newCartItem
        newCartItem.id = self.data.goods.id
        newCartItem.title = self.data.goods.title
        newCartItem.image = self.data.goods.thumb
        newCartItem.num = self.data.num
        newCartItem.price = self.data.goods.price
        newCartItem.basePrice = self.data.goods.basePrice
        // newCartItem.selected: true

        self.addCartItemToStorage(newCartItem)

    },

    addCartItemToStorage(item) {
        console.log(item)
        const self = this;
        if (self.data.cartList.length > 0) {

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
        } else {
            self.data.cartList.push(item)
            self.setData({
                cartList: self.data.cartList
            })
        }

        wx.setStorage({
            key: "cartList",
            data: self.data.cartList,
            success: function(res) {
                const num = self.data.num;
                let total = self.data.totalNum;
                let numInCartOld = self.data.numInCart;
                //动画效果
                self.setData({
                    show: true
                })
                setTimeout(function() {
                    self.setData({
                        show: false,
                        scaleCart: true
                    })
                    setTimeout(function() {
                        self.setData({
                            scaleCart: false,
                            hasCarts: true,
                            totalNum: num + total, //新增+已有
                            numInCart: num + numInCartOld
                        })
                    }, 200)
                }, 300)
            },
            fail: function() {
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
    updateTotalNum() {
        var self = this
        wx.getStorage({
            key: 'cartList',
            success: function(res) {
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
    onLoad: function(options) {
        this.prepare(options)


    },
    prepare: function(options) {
        let self = this
        
        self.setData({
            productId: options.id,
            openId: app.globalData.openId
        });
        // //如果是分享的页面
        // if (Object.prototype.toString.call(options) !== '[object Undefined]' && Object.prototype.toString.call(options.targetShopId) !== '[object Undefined]') {
        //     if (app.globalData.openId != "" && app.globalData.openId != null) {
        //         let openId = app.globalData.openId
        //         let targetShopId = options.targetShopId
        //         let productId = options.id
        //         //检查当前用户是否可以进入目标店铺
                
        //         let url = COM.load('CON').APPLY_TO_SHOP;
        //         COM.load('NetUtil').netUtil(url, "POST", {
        //             "open_id": openId,
        //             "shop_id": targetShopId
        //         }, (callback) => {

        //             if (callback == false) {
        //                 wx.showModal({
        //                     title: '提示',
        //                     content: '您暂时无法购买此店铺的商品，我们已经为您向店主申请进入, 请等待店主审核后方可进店购物, 点击确认进入展厅',
        //                     success: function(res) {
        //                         if (res.confirm) {
        //                             console.log('用户点击确定')
        //                             wx.navigateTo({
        //                                 url: '/page/welcome/welcome?targetShopId=oVxpo5FQkb2qY4TGpD9rq2xFWRlk',
        //                             })
        //                         } else if (res.cancel) {
        //                             console.log('用户点击取消')
        //                             wx.navigateBack({
        //                                 delta: -1
        //                             })
        //                         }
        //                     }
        //                 })
        //             } else {
        //                 //将得到的shopid 写入缓存并改写global shopid
        //                 wx.setStorageSync('targetShopId', targetShopId, )

        //                 app.globalData.targetShopId = targetShopId

						
        //             }
        //         })
        //     } else {
        //         setTimeout(function() {

        //             self.prepare(options)
		// 			return;
        //         }, 1000)
        //     }
        // }

		let url = ""
		let productId = self.data.productId
		if (app.globalData.targetShopId != "" && app.globalData.targetShopId != null) {
			url = COM.load('CON').GET_TARGETSHOP_PRODUCT_URL + app.globalData.openId + "/" + app.globalData.targetShopId + "/" + productId
		} else {
			url = COM.load('CON').GET_TARGETSHOP_PRODUCT_URL + app.globalData.openId + "/" + app.globalData.openId + "/" + productId
		}
		console.log("2")
		console.log(url)

		COM.load('NetUtil').netUtil(url, "GET", "", (shopProduct) => {
			console.log(shopProduct)
			if (shopProduct) {
				let products = wx.getStorageSync("shopProducts");

				if (products) {
					self.data.goods["id"] = productId;
					self.data.goods["title"] = products[productId].title;
					self.data.goods["thumb"] = COM.load('Util').image(products[productId].barcode);
					self.data.goods["stock"] = shopProduct.stock;
					self.data.goods["price"] = shopProduct.vipPrice;
					self.data.goods["basePrice"] = products[productId].basePrice;
					
					// http://101.178.98.25:8443/api/mall/products/242
					let detailUrl = COM.load('CON').PRODUCT_DETAIL_URL + productId;
					COM.load('NetUtil').netUtil(detailUrl, "GET", "", (detail) => {
						if (detail.images) {
							if (detail.images.length > 0) {
								detail.images = JSON.parse(detail.images)
								for (var i = 0; i < detail.images.length; i++) {
									detail.images[i] = COM.load('CON').IMG_DETAIL_BASE + "storage/" + detail.images[i];
								}
							}
							
							self.setData({
								detail: detail
							})
						}

						if(detail.comments.length > 0)
						{
							self.setData({
								hasComments: true
							})
							
							console.log(self.data.hasComments)
							let comments = detail.comments
							for (var i = 0; i<comments.length; i++)
							{
								comments[i].userName = comments[i].userName.replace(/.(?=.)/g, '*')
								if (comments[i].images)
								{
									let commentImages = JSON.parse(comments[i].images);
									for (var j = 0; j < commentImages.length; j++) {
										commentImages[j] = COM.load('CON').IMG_COMMENT + comments[i].id + "/" + commentImages[j] + ".png";
									}
									comments[i].images = commentImages
								}else{
									comments[i].images =[]
								}
								

							}
							console.log(comments)
							self.setData({
								comments:comments
							})
							
						}
					});

					self.setData({
						goods: self.data.goods
					})

          //TO DO 应该先知道是不是有这些 有的话再索取
					self.getSpecialPrice();
          			self.getGroupInfo();

					self.updateTotalNum();
				}
			}
		});
    },
    getGroupInfo: function(){
      let self = this
      let shopId = app.globalData.targetShopId
      let productId = self.data.goods['id']
      let url = COM.load('CON').GET_GROUPINFO + shopId + "/" + productId;
      COM.load('NetUtil').netUtil(url, "GET", "", (result) => {
        if (result.flag) {
          console.log(result)
          let groupList = result.groupList
          if (groupList != null && groupList != "" && groupList.length > 0)
          {
            for(var g in groupList)
            {
              if (groupList[g].orderList != null && groupList[g].orderList != "")
              {
                groupList[g].orderList = JSON.parse(groupList[g].orderList)
                for (var o in groupList[g].orderList)
                {
                  groupList[g].joined = groupList[g].orderList[o].openId == app.globalData.openId ? true : false;
                 
                }
              }
              
              
            }
          }
          self.setData({
            groupInfo: result.groupInfo,
            
            groupList: groupList
          })
        }
      })
    },
    getSpecialPrice: function() {

        let self = this
        let productIdList = JSON.stringify([self.data.goods["id"]]);

        let url = COM.load('CON').GET_SPECIAL_PRICE_LIST + productIdList + "/" + app.globalData.openId + "/" + app.globalData.targetShopId;
        COM.load('NetUtil').netUtil(url, "GET", "", (specialPriceList) => {
            if (specialPriceList) {

                let spl = JSON.parse(specialPriceList)
                console.log(spl[self.data.goods["id"]])
                self.setData({
                    specialPrices: spl[self.data.goods["id"]],

                });
            }
        }, true, false)
    },

    createGroup: function(e){
      console.log(e)
      let self = this
      let groupInfoId = e.currentTarget.dataset.groupinfoid
      let url = COM.load('CON').CREATE_GROUP;
      COM.load('NetUtil').netUtil(url, "POST", {"openId": app.globalData.openId, "shopProductGroupId": groupInfoId}, (result) => {
        if (result) {

        wx.showModal({
          title: '开团成功',
          content: '您可以在本页分享您的团，邀请朋友一起拼团',
          showCancel:false,
          success: function(res){
            if(res.confirm)
            {
              console.log("eeeeeeeeeeeeeeeeeeee")
              self.getGroupInfo();
            }
          }
        })
        }
      })
    },
    /**
     * 加载相应店铺的商品价格和库存
     */
    onShow: function() {


    },
    showSpecialPrice: function(e) {
        let self = this

        self.setData({

            showModal: true
        });
    },
    bindPreviewImage: function(e) {
        console.log(e)
        console.log(this.data.detail.images)
        var curData = e.currentTarget.dataset;
        var images = this.data.detail.images;
        wx.previewImage({
            current: curData.current,
            urls: images
        })
    },
	commentImgView:function(e){
		let self = this
		console.log(e)
		var curData = e.currentTarget.dataset.img;
		var id = e.currentTarget.dataset.id;
		console.log(self.data.comments);
		console.log(id)
		wx.previewImage({
			current: curData,
			urls: self.data.comments[id].images
		})
	},
    onShareAppMessage: function() {
        let self = this
        let openId = app.globalData.openId;
        let shopId = (app.globalData.targetShopId != "" && app.globalData.targetShopId != null) ? app.globalData.targetShopId : app.globalData.openId

        return {
            title: '真实澳洲直邮 朋友分享的海淘',
            desc: self.data.goods["title"],
			path: '/page/welcome/welcome?productId=' + self.data.productId + '&targetShopId=' + shopId,
            success: function(res) {
                // 转发成功
				wx.showModal({
					title: '提示',
					content: '分享成功',
					showCancel:false,
				})
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },

    toGroup: function(e){
     
      let data = []
      let self = this
      let good = self.data.goods
      console.log(good)
      console.log(e)
      data.push({        
        "id" : good.id,
        "image": good.thumb,
        "num": 1,
        "price": e.currentTarget.dataset.price,
        "title": good.title,
        "extraType" : 1,
        "extraTypeReferenceId" : e.currentTarget.dataset.groupbuyid
      })
      let orderInfo = {
        'data': data
      }
      wx.setStorageSync("orderInfo", orderInfo)
      wx.navigateTo({
        url: '/page/cart/orders/orders',
      })
    },

    
    hideModal: function() {
        this.setData({
            showModal: false
        });
    }


})