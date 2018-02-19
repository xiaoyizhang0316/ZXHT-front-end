// var Util = require('../../../../utils/util.js');

var COM = require('../../../../utils/common.js');
var app = getApp()

Page({

  data: {
    orderId: '',
    order: {},
    receiver: null,
    status: '已提交',
    orderTime: null,
    merchant: null,
    totalweight: null,
    totalPrice: null,
    totalQuantity: null,
    deliveryPrice: 0,
    discountValue: 0,
    checkbox: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var order;
    if (options.order) {
      order = JSON.parse(options.order);
    } else {
      var orderId = options.orderId;
      let pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]
      let orderList = prevPage.data.orderHistoryList
      order = orderList.filter(function (val) {
        if (val.orderInfo.id == orderId) {
          return val
        }
      });
    }
    

    var numofGoods = 0;
    console.log(order[0].orderGoods[0].num)
    for (var index = 0; index < order[0].orderGoods.length; index++) {
      console.log("hahahah")
      numofGoods = numofGoods + order[0].orderGoods[index].num
    }
    console.log(numofGoods)

    this.setData({
      order: order[0],
      orderId: options.orderId,
      orderTime: order[0].orderInfo.addTime,
      merchant: order[0].orderInfo.shopId,
      // service: order.orderInfo.service,
      // sender: order[0].sender,
      items: order[0].orderGoods,
      totalPrice: order[0].orderInfo.goodsCost,
      totalQuantity: numofGoods,
      // totalWeight: order[0].totalWeight,
      receiver: order[0].consignee,
      deliveryPrice: order[0].orderInfo.shippingCost,
      discountValue: order[0].orderInfo.discount,
      merchant: order[0].sellerShop.shopName
    });
    let s = JSON.stringify(this.data.order);
    console.log(JSON.parse(s));

    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }
    });
  },

  insert: function () {
    var cb = this.data.checkbox;
    console.log(cb);
    cb.push(this.data.checkbox.length);
    this.setData({
      checkbox: cb
    });
  },

  delBind: function () {
    var cb = this.data.checkbox;
    console.log(cb);
    cb.pop(this.data.checkbox.length);
    this.setData({
      checkbox: cb
    });
  },


  delOrder: function (e) {
    var self = this;
    wx.showModal({
      content: '确定删除此订单?',
      showCancel: true,
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          try {
            let orderList = wx.getStorageSync('orderHistoryList');
            let newList = orderList.filter(function (val) {
              return (val.orderId != e.currentTarget.dataset.order);
            });
            let url = COM.load('CON').CANCEL_ORDER_BUYER + e.currentTarget.dataset.order;
            COM.load('NetUtil').netUtil(url, "PUT", {}, (callback) => {
              console.log(callback)
            })
            wx.setStorage({
              key: "orderHistoryList",
              data: newList,
              success: function () {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } catch (e) {
            console.log(e);
          }
        }
      }
    })
  },

  // updateStauts: function(e) {
  //   wx.navigateTo({
  //     url: '/pages/detail/detail?order=' + this.data.orderId + '&status=' + event.currentTarget.dataset.status + '&customer=' + receiverName + '&delivered=' + delivered
  //   })
  // },

  copyOrderId: function (e) {
    let self = this;
    wx.setClipboardData({
      data: self.data.orderId,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '拷贝至剪贴板',
              icon: 'success',
              duration: 1200
            })
          }
        })
      }
    })
  },

  makeCall: function (e) {
    let number = e.currentTarget.dataset.mobile;
    COM.load('Util').makeCall(number);
  },
	formSubmit: function(e)
	{
		let ship = {}
		let shipGoods = []
		console.log(e.detail)
		ship.orderId = this.data.orderId;
		ship.agentId = e.detail.value.agentId
		ship.receiptNumber = e.detail.value.receiptNumber
		ship.senderId = app.globalData.openId
		// TODO 暂时一个订单一个发货单
		ship.shippingCost = this.data.deliveryPrice;

		//TODO 商品也暂时都放在一个单里
		for(var i = 0; i < this.data.items.length; i++)
		{
			let shipGood = {}
			
			console.log(this.data.items[i].productId)
			shipGood.productId = this.data.items[i].productId;
			shipGood.sendNumber = this.data.items[i].num;
			shipGoods.push(shipGood);
		}
		let shipFull = []
		shipFull.push({ship,shipGoods})
		let url = COM.load('CON').SAVE_SHIPORDER;
		console.log(shipFull)
		COM.load('NetUtil').netUtil(url, "POST", shipFull, (callback) => {
			console.log(callback)
			wx.redirectTo({
				url: '/page/mine/sell_order/sell_orderHistory'
			})

		})
	},

  placeOrder: function (e) {
    console.log(e)
    console.log(this.data.order)
    this.data.order.orderInfo.discount = this.data.discountValue
    this.data.order.orderInfo.shippingCost = this.data.deliveryPrice
    let url = COM.load('CON').CONFRIM_ORDER_URL
    COM.load('NetUtil').netUtil(url, "PUT", this.data.order.orderInfo, (callback) => {
      console.log(callback)
			wx.redirectTo({
				url: '/page/mine/sell_order/sell_orderHistory'
			})

    })
   
  },

  updateDeliveryPrice: function (e) {
    if (e.detail.value > 0) {
      this.setData({
        deliveryPrice: e.detail.value
      });
    }
  },

  updateDiscountValue: function (e) {
    if (e.detail.value > 0) {
      this.setData({
        discountValue: e.detail.value
      });
    }
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
  //   return {
  //     title: this.data.orderId + ' 订单详情',
  //     path: '/pages/personal/order/detail/orderDetail?order=' + JSON.stringify(this.data.order) +"&shared=true"
  //   }
  // },
})