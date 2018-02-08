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
    ordersList: {},
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

  reset: function (e) {
    this.showOrderList();
    this.setData({ search: '', displayClear: false });
  },

  searchOrder: function(e) {
    let orderHistoryList = wx.getStorageSync('orderHistoryList');
    let text = Util.trim(e.detail.value);
    let rows = [];
    for (var key in orderHistoryList) {
      let order = orderHistoryList[key];
      let name = order.receiver.name;
      let phone = order.receiver.phone;
      let items = order.items;
      if (name.search(text) !== -1|| phone.search(text) !== -1) {
        rows.push(order);
      } else {
        for (let x in items) {
          if (items[x].title.toUpperCase().search(text.toUpperCase()) !== -1){ 
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
    this.filterOrders();
    // this.showOrderList();
  },

  showOrderList: function(e) {
    let self = this;
    wx.getStorage({
      key: 'orderHistoryList',
      success: function (res) {
        self.setData({
          orderHistoryList: res.data.reverse(),
        });
      }
    })
  },

  filterOrders: function () {
    let self = this;
    let shopId = app.globalData.openId;
    let url = COM.load('CON').GET_ALL_ORDERS_SELLER + shopId;
    // let url = 'https://00dc6464.ngrok.io/api/mall/orders/getOrders/2/' + shopId;
    COM.load('NetUtil').netUtil(url, "GET", "", (orders) => {
      let ordersMap = new Map();
      console.log(orders)
      if (orders != "") {

        for (var x in orders) {
          let order = orders[x];
          let Info = order.orderInfo;
          let Goods = order.orderGoods;
          ordersMap.set(Info.id,
            {
              order: order[0],
              orderId: Info.id,
              // logo: order[0].logo,
              // shared: shared,
              // orderTime: order[0].orderTime,
              // merchant: order[0].merchant,
              // service: order[0].service,
              // sender: Info.senderId,
              // receiver: order[0].receiver,
              items: Goods,
              // totalPrice: order[0].totalPrice,
              // totalQuantity: order[0].totalQuantity,
              // totalWeight: order[0].totalWeight,
              // receiverName: order[0].receiver.name,
            })
        }
        this.setData({
          ordersList: Array.from(ordersMap.values()),
          ordersMap: ordersMap
        })
        wx.setStorage({
          key: "sellOrderList",
          data: ordersList,
          success: function () {
            self.showOrderList();
          }
        })
      }
    });
  },

  clickOrder: function (e) {
    wx.navigateTo({
      url: './sell_detail/sell_orderDetail?orderId=' + e.currentTarget.dataset.order,
    })
  },

  delOrder: function (e) {
    var self = this;
    wx.showModal({
      content: '确定删除此订单?',
      showCancel: true,
      confirmText:'删除',
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

  placeOrder: function(e) {
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