var COM = require('../../../utils/common.js')

Page({
  data:{
    address:{},
    hasAddress: false,
    memo:'',
    total:0,
    orders:[],
    animationData: {},
    showModalStatus: false,
  },

  onReady() {
    this.getTotalPrice();
  },
  
  //如果为onShow那么会即时显示默认地址
  onLoad:function(){
    const self = this;
    wx.getStorage({
      key:'addressList',
      success(res) {
        if(res.data.length >= 1) {

          var index = 0;//默认使用第一个
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].isDefault == true) {
                index = i;
                break;
            }
          }
          self.setData({
            address: res.data[index],
            hasAddress: true
          })
        }else{
          // hasAddress: false
        }
      }
    })

    wx.getStorage({
      key: 'orderInfo',
      success(res) {
        console.log(res.data)
        self.setData({
          orders: res.data.data,
        })

      },
      fail(){
        console.log('fail')
      }
    })

  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    let totalNum = 0;
    for(let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
      totalNum += orders[i].num;
    }
    this.setData({
      total: total.toFixed(2),
      totalNum: totalNum
    })
  },

  bindExtra:function() {
    wx.navigateTo({
      url: "/page/common/templates/textArea/textArea?content=" + this.data.memo + "&placeHolder=告诉卖家是否需要拍照签字等服务"
    })
  },

  placeOrder() {
    let orderTime = COM.load('Util').formatTime(new Date());
    let sender = {"name":'david',"phone":'0416520213'};
    let orderHistory = {
      orderId: COM.load('Util').guid(),
      merchant: '店铺名称',
      orderTime: orderTime,
      sender: sender,
      memo: this.data.memo,
      receiver: this.data.address,
      items: this.data.orders,
      totalPrice: this.data.total,
      totalQuantity: this.data.totalNum,
      status: '已提交',
    };

    this.saveToOrderHistory(orderHistory);
    wx.removeStorageSync("cartList");

    wx.showToast({
      title: '提交订单成功',
      icon: 'loading',
      duration: 2000,
      success: function () {
        wx.switchTab({
          url: '/page/index/index',
        })
      }
    })
   
  },

  saveToOrderHistory: function (data) {
    let self = this;
    let orderHistoryList = wx.getStorageSync('orderHistoryList');
    if (!orderHistoryList) {
      orderHistoryList = [];
    };
    orderHistoryList.push(data);
    wx.setStorage({
      key: "orderHistoryList",
      data: orderHistoryList
    })
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

})