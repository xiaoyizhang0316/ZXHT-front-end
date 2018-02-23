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
  formSubmit: function (e) {
    let self = this
    // 验证字段的规则
    const rules = {
      name: {
        required: true,
        name: true
      },
      phone: {
        required: true,
        tel: true,
      },
      identityCard: {
        required: true,
        idcard: true
      },
      detail: {
        required: true
      },
      city: {
        required: true
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      name: {
        required: '请输入姓名',
        name: '请输入正确的姓名'
      },
      phone: {
        required: '请输入手机号',
        tel: '请输入正确的手机号',
      },
      identityCard: {
        required: '请输入身份证号码',
        idcard: '请输入正确的身份证号码',
      },
      detail: {
        required: '请输入完整地址信息'
      },
      city: {
        required: '请输入地址信息'
      }
    }
    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      wx.showModal({
        title: '添加收货人失败',
        content: error.msg
      })
    }

    let numOfShippingform = self.data.checkbox.length
    let shipAll = {}
    let shipGoodsAll = []
    var i = 0
    for (i = 0; i < numOfShippingform; i++) {
      let shipdetail = {}
      shipdetail.orderId = self.data.orderId
      shipdetail.agentId = e.detail.value["agentId[" + i + "]"]
      shipdetail.receiptNumber = e.detail.value["receiptNumber[" + i + "]"]
      shipdetail.senderId = app.globalData.openId
      shipdetail.shippingCost = e.detail.value["shipFee[" + i + "]"]
      shipAll[i] = shipdetail
      console.log("***********")
      let shipGoodsOne = {}
      for (var j = 0; j < self.data.items.length; j++) {
        let productId = self.data.items[j].productId
        let sendNumber = e.detail.value["shipGoods[" + i + "][" + self.data.items[j].productId + "]"]
        shipGoodsOne[j] = { productId, sendNumber }
      }
      shipGoodsAll.push(shipGoodsOne)
    }
    console.log(shipGoodsAll.length)
    console.log(shipAll)

    var i
    let shipFull = []
    for (i = 0; i < numOfShippingform; i++) {
      let shipGoods = []
      for (var k = 0; k < shipGoodsAll.length; k++) {
        shipGoods.push(shipGoodsAll[i][k])
      }
      let ship = shipAll[i]
      shipFull.push({ ship, shipGoods })
    }

    let url = COM.load('CON').SAVE_SHIPORDER;
    console.log("********************")
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