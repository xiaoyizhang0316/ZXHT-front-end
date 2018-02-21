var Util = require('../../../utils/util.js');
var app = getApp()
var COM = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayClear: false,
    orderHistoryList: [],
    rowFocusFlagArray: [],
    animationData: {},
    showModalStatus: false,
    selectedOrder: Object
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  reset: function (e) {
    this.showOrderList();
    this.setData({ search: '', displayClear: false });
  },

  //搜索还没做完
  searchOrder: function (e) {
    let orderHistoryList = wx.getStorageSync('orderHistoryList');
    let text = Util.trim(e.detail.value);
    let rows = [];
    for (var key in orderHistoryList) {
      let order = orderHistoryList[key];
      let name = order.consignee.name;
      let phone = order.consignee.phone;
      let items = order.orderGoods;
      if (name.search(text) !== -1 || phone.search(text) !== -1) {
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
    let self = this
    let url = COM.load('CON').GET_ALL_ORDERS_BUYER + app.globalData.openId;
    COM.load('NetUtil').netUtil(url, "GET", {}, (callback) => {
      console.log(callback)
      self.setData({
        orderHistoryList: callback
      })
    })
  },

  clickOrder: function (e) {
    wx.navigateTo({
      url: './detail/orderDetail?orderId=' + e.currentTarget.dataset.order,
    })
  },

  delOrder: function (e) {
    var self = this;
    wx.showModal({
      content: '确定取消此订单?',
      showCancel: true,
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          try {

            let orderList = self.data.orderHistoryList;
            let newList = orderList.filter(function (val) {
              return (val.orderInfo.orderId != e.currentTarget.dataset.order);
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
  getLogo: function (productId) {
    let products = wx.getStorageSync("products");
    return COM.load('Util').image(products[productId].barcode)
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

  // 显示遮罩层
  showModal: function (e) {
    let orderList = this.data.orderHistoryList;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
		console.log(orderList)
		console.log(e.currentTarget.dataset)
    console.log(orderList[e.currentTarget.dataset.id])
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      selectedOrder: orderList[e.currentTarget.dataset.id],
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

  //确认支付
  payOrder: function (e) {
    var self = this;
    let orderList = self.data.orderHistoryList;
    console.log(e.currentTarget.dataset.order)
    let url = COM.load('CON').PAY_ORDER_URL + e.currentTarget.dataset.order+"/"+app.globalData.openId;
    console.log(url)
    COM.load('NetUtil').netUtil(url, "GET", {}, (callback) => {
      if(callback.flag == true)
			{
				let params = callback.params;
				wx.requestPayment(
					{
						'timeStamp': params.timeStamp,
						'nonceStr': params.nonceStr,
						'package': params.package,
						'signType': params.signType,
						'paySign': params.paySign,
						'success': function (res) {
							console.log("yeah");
						 },
						'fail': function (res) { 
							console.log("fuck");
						},
						'complete': function (res) { 
							console.log("done");
						}
					})
			}
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