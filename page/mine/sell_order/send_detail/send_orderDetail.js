// var Util = require('../../../../utils/util.js');
import WxValidate from "../../../../utils/Validate/WxValidate.js"
import download from "../../../../utils/downloadFile.js"
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
	shipAgents:[],
	index: [],
	finalPayment: 0,
	shippingCost: 0,
	payment: null,
	shipFulls: [],
	totalCost: 0,
	sellShopId: null,
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
	let shipAgents = wx.getStorageSync("shipAgents")
	let payments = wx.getStorageSync("payments")
    this.setData({
      order: order[0],
      orderId: options.orderId,
      orderTime: order[0].orderInfo.addTime,
      
	  sellShopId: order[0].orderInfo.shopId,
      // service: order.orderInfo.service,
      // sender: order[0].sender,
      items: order[0].orderGoods,
      totalPrice: order[0].orderInfo.totalCost,

      totalQuantity: numofGoods,
      // totalWeight: order[0].totalWeight,
      receiver: order[0].consignee,
      deliveryPrice: order[0].orderInfo.shippingCost,
      discountValue: order[0].orderInfo.discount,
      merchant: order[0].sellerShop.shopName,
	  shipAgents: shipAgents,
	  finalPayment: order[0].orderInfo.finalPayment,
	  shippingCost: order[0].orderInfo.shippingCost,
	  payment: payments[order[0].orderInfo.payId - 1].name,
	  shipFulls: order[0].shipFulls

    });
	console.log(this.data.shipAgents);
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
	var index = this.data.index;
    console.log(cb);
    cb.push(this.data.checkbox.length);
	index.push(0);
    this.setData({
      checkbox: cb,
	  index: index
    });
  },

  delBind: function () {
    var cb = this.data.checkbox;
	var index = this.data.index;
    console.log(cb);
    cb.pop(this.data.checkbox.length);
	index.pop(this.data.checkbox.length);
    this.setData({
      checkbox: cb,
	  index:index
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
    let numOfShippingform = self.data.checkbox.length
    let shipAll = {}
    let shipGoodsAll = []
		
		let shipFull = []
    if(numOfShippingform == 0)
	{
		wx.showModal({
			title: '错误',
			content: '发货单不能为空！',
			showCancel: false,
		
		})
		return
	}
    for (var i = 0; i < numOfShippingform; i++) {
      let shipdetail = {}
      shipdetail.orderId = self.data.orderId
      shipdetail.agentId = e.detail.value["agentId[" + i + "]"]
      shipdetail.receiptNumber = e.detail.value["receiptNumber[" + i + "]"]
      shipdetail.senderId = self.data.sellShopId
      shipdetail.shippingCost = e.detail.value["shipFee[" + i + "]"]
			let checkRes = self.checkShipDetail(shipdetail)
			if(!checkRes.flag)
			{
				wx.showModal({
					content: checkRes.message,
					showCancel: false,
					confirmText: '确认',
					success: function (res) {
						return
					}
				})
				return
			}


      shipAll[i] = shipdetail
      console.log("***********")
      let shipGoodsOne = {}
      for (var j = 0; j < self.data.items.length; j++) {
        let productId = self.data.items[j].productId
        let sendNumber = e.detail.value["shipGoods[" + i + "][" + self.data.items[j].productId + "]"]
		let title = self.data.items[j].title
		let image = self.data.items[j].image
        shipGoodsOne[j] = { productId,title, image, sendNumber }			
      }
			
      shipGoodsAll.push(shipGoodsOne)
    }
    
    console.log(shipAll)
		console.log(shipGoodsAll)
		console.log("********************")

   
    for (var g = 0; g < numOfShippingform; g++) {
      let shipGoods = []
			console.log(shipGoodsAll[0])
			console.log(shipGoodsAll[0].length)
			for (var k = 0; k < Object.keys(shipGoodsAll[g]).length; k++) {
				console.log("+++++++++++++++")
				console.log(shipGoodsAll[g][k])
        shipGoods.push(shipGoodsAll[g][k])
      }
			console.log("-------------------------")
			console.log(shipGoods)
      let ship = shipAll[g]
      shipFull.push({ ship, shipGoods })
    }

    let url = COM.load('CON').SAVE_SHIPORDER;
    
    console.log(shipFull)


    COM.load('NetUtil').netUtil(url, "POST", shipFull, (callback) => {
      console.log(callback)
      wx.redirectTo({
        url: '/page/mine/sell_order/sell_orderHistory'
      })
    })
  },
 editOrderExtraService: function(e){
	 console.log(e)
	 let orderExtraServiceId = e.currentTarget.dataset.index
	 //TODO
	 wx.navigateTo({
		 url: '/page/common/templates/editOrderExtraSerivce/editOrderExtraService?id=' + orderExtraServiceId
	 })
 },
	downloadIDs: function(e){
		let imgID = COM.load('CON').IMG_ID

		console.log(this.data.receiver)
		let url1 = imgID + this.data.receiver.correctSidePic + ".png";
		let url2 = imgID + this.data.receiver.oppositeSidePic + ".png";
		console.log("++++++++++++++++++++++++++++++++++++++++++++")
		
		console.log(url2)
		download.downloadSaveFiles({
			urls: [url1, url2],
			success: function (res) {
				// console.dir(res);

				console.info(res.get(url2).savedFilePath)
			},
			fail: function (e) {
				console.info("下载失败");
			}
		});
		
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
	required(value) {
	 if (typeof value === 'number') {
			value = value.toString()
		} else if (typeof value === 'boolean') {
			return !0
		}

		return value.length > 0
	},
	digits: function (value) {
		return /^\d+$/.test(value)
	},
	checkShipDetail: function(shipdetail){
		let self = this
		let res = {
			"flag" : false,
			"message" : ""
		}

		if (!self.required(shipdetail.agentId) || !self.digits(shipdetail.agentId) )
		{
			res.message = "快递公司必须为数字"
			return res;
		}

		if (!self.required(shipdetail.receiptNumber))
		{
			res.message = "快递单号为必填"
			return res;
		}

		if (!self.required(shipdetail.shippingCost) || !(shipdetail.shippingCost >= 0))
		{
			res.message = "发货费用为必填并且大于0"
			return res;
		}
		res.flag=true;
		return res;
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
	  //如果是线下支付 并且是要发货 提示收到钱后再发货
	  console.log("------------------------------")
	  console.log(this.data.order)
	  if (this.data.order.orderInfo.payId == 1 && this.data.order.orderInfo.orderStatus == 3)
	  {
		  wx.showModal({
			  title: '注意！',
			  content: '此订单为线下支付, 请注意在确定收到订金后再发货！',
		  })
	  }
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
  bindShipAgentChange: function (e) {
	  console.log(e)
	let index = this.data.index;
	let ind = e.currentTarget.dataset.id;
	index[ind] = e.detail.value;
	  this.setData({
		  index: index
	  })
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