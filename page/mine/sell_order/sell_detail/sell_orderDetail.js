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
    totalQuantity: null
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
    });
    let s= JSON.stringify(this.data.order);
    console.log(JSON.parse(s));
  },


  delOrder: function (e) {
    var self = this;
    wx.showModal({
      content: '确定删除此订单?',
      showCancel: true,
      confirmText: '删除',
      success: function (res) {
        if (res.confirm) {
          try {
            let orderList = wx.getStorageSync('orderHistoryList');
            let newList = orderList.filter(function (val) {
              return (val.orderId != e.currentTarget.dataset.order);
            });

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

  copyOrderId:function(e) {
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

  placeOrder: function (e) {
    wx.redirectTo({
      url: '/pages/send/' + this.data.logo + '/send?order=' + this.data.orderId,
    })
  },

  updateDeliveryPrice: function (e) {
    let DeliverPrice = e.detail.value;
    if (DeliverPrice > 0.1) {
      this.setData({ 'DeliverPrice': DeliverPrice });
    }
  },

  updateDiscountPrice: function (e) {
    let DiscountPrice = e.detail.value;
    if (DiscountPrice > 0.1) {
      this.setData({ 'DiscountPrice': DiscountPrice });
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