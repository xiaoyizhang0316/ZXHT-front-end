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
    this.setData({ productId : options.id});
    let products = wx.getStorageSync("products");
    if (products) {
      this.data.goods["id"] = options.id;
      this.data.goods["title"] = products[options.id].title;
      this.data.goods["thumb"] = COM.load('Util').image(products[options.id].barcode);
     
      // http://101.178.98.25:8443/api/mall/products/242
      let detailUrl = COM.load('CON').PRODUCT_URL + options.id;
      COM.load('NetUtil').netUtil(detailUrl, "GET", "", (detail) => {
        if (detail) {
          console.log(detail)
          this.setData({
            detail: detail
          })
        }
      });

      this.setData({
        goods: this.data.goods
      })

      this.updateTotalNum();
    }
  
  },


/**
 * 加载相应店铺的商品价格和库存
 */
  onShow: function () {
    let productId = this.data.productId, shopOpenId = app.globalData.shopOpenId;
    let url = COM.load('CON').SHOP_PRODUCT_URL + "search/" + shopOpenId + "/" + productId;
    COM.load('NetUtil').netUtil(url, "GET", "", (product) => {
      if (product) {
        this.data.goods["detail"] = product.memo;
        this.data.goods["price"] = product.vipPrice;
        this.data.goods["stock"] = product.stock;

        this.setData({
          goods: this.data.goods
        })

      }
    });

  },

    
})