var app = getApp();
var COM = require('../../../utils/common.js')
var Util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayClear: false,
    orderHistoryList: [],
    rowFocusFlagArray: [],
    ordersMap: Object,
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

	bindChange:function(e){
		
		var that = this;
		that.setData({ currentTab: e.detail.current });
	},
  reset: function (e) {
    this.showOrderList();
    this.setData({ search: '', displayClear: false });
  },

  searchOrder: function (e) {
	  let self = this
	  let orderHistoryList = this.data.orderHistoryList;
	  let text = Util.trim(e.detail.value);
	  let rows = [];
	  for (var key in orderHistoryList) {
		  let order = orderHistoryList[key];

		  let name = order.consignee.name;
		  let phone = order.consignee.phone;
		  let items = order.orderGoods;
		  let orderSN = order.orderInfo.orderSN;
		  if (name.search(text) !== -1 || phone.search(text) !== -1 || orderSN.search(text) !== -1) {
			  rows.push(order);
		  } else {
			  for (let x in items) {
				  if (items[x].title.toUpperCase().search(text.toUpperCase()) !== -1) {
					  rows.push(order);
					  break;
				  }
			  }
		  }
	  }
	  this.setData({ orderHistoryList: rows, displayClear: true });
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    this.showOrderList();
  },

  showOrderList: function (e) {
    let self = this;
    let shopId = app.globalData.openId;
    let url = COM.load('CON').GET_ALL_ORDERS_SELLER + shopId;
    COM.load('NetUtil').netUtil(url, "GET", {}, (callback) => {
      console.log(callback)
      self.setData({
        orderHistoryList: callback
      })
    })
  },


  clickOrder: function (e) {
	  
    wx.redirectTo({
      url: './sell_detail/sell_orderDetail?orderId=' + e.currentTarget.dataset.order,
    })
  },

  cancelOrder: function (e) {
    var self = this;
    console.log(e)
    wx.showModal({
      content: '确定取消此订单?',
      showCancel: true,
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          try {
            let orderList = self.data.orderHistoryList;
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
                self.showOrderList();
              }
            })
          } catch (e) {
            console.log(e);
          }
        }
      }
    })
  },

  placeOrder: function (e) {
    wx.redirectTo({
      url: '/pages/send/' + e.currentTarget.dataset.logo + '/send?order=' + e.currentTarget.dataset.order,

    })
  },

  mytouchstart: function (e) {
    let self = this;
    let rowFocusFlagArray = [];
    var index = e.currentTarget.dataset.index;
    rowFocusFlagArray[index] = 1;
    self.setData({
      touch_start: e.timeStamp,
      rowFocusFlagArray: rowFocusFlagArray
    })
  },

  mytouchend: function (e) {
    let self = this;
    let rowFocusFlagArray = [];
    var index = e.currentTarget.dataset.index;
    rowFocusFlagArray[index] = 0;
    self.setData({
      touch_end: e.timeStamp,
      rowFocusFlagArray: rowFocusFlagArray
    })
  },

  sendOrder: function (e) {
    wx.navigateTo({
      url: './send_detail/send_orderDetail?orderId=' + e.currentTarget.dataset.order,
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

  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})