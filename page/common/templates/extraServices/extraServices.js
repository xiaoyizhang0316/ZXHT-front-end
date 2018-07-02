// page/common/templates/extraServices/extraServices.js
import WxValidate from "../../../../utils/Validate/WxValidate.js"
import download from "../../../../utils/downloadFile.js"
var COM = require('../../../../utils/common.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  services:[],
	  //orderExtraServices:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  console.log(options)
	  let shopId = options.shopId
	  let url = COM.load('CON').GET_EXTRASERVICES_BY_SHOP + shopId
	  let pages = getCurrentPages();
	  let prevPage = pages[pages.length - 2];  //上一个页面
	  
	  let self = this
	  let orderExtraServices = prevPage.data.orderExtraServices;
	  console.log(orderExtraServices)
	  COM.load('NetUtil').netUtil(url, "GET", "", function (res) {
		  console.log(res)
		  res.forEach(function(v){
			  //assign false because firstly all true
			  v.enable = false;
			  orderExtraServices.forEach(function(value){
				  if(v.id == value.extraServicesId)
				  {
					  console.log(v.id)
					  v.enable = true					 
				  }
			  })
			//   if (!orderExtraServices.includes(v.id))
			//   {v.enable= false;}
		  })
		 // console.log(res)
		  self.setData({
			  services:res
		  })
	  })
  
  },
  bindService:function(e){
	  let self = this
	  let services = self.data.services
	  services[e.target.dataset.index].enable = !services[e.target.dataset.index].enable
	  self.setData({
		  services:services
	  })

  },
  formSubmit: function(e)
  {
	  let self = this
	  let services = self.data.services
	  let orderExtraServices = []
	  let price = 0
	  services.forEach(function(v){
		  if(v.enable)
		  {
			orderExtraServices.push({
				extraServicesId: v.id,
				price: v.price,
				name : v.name
			})
			price = (price*100 + v.price*100) /100
		  }
	  })
	  let pages = getCurrentPages();
	  let prevPage = pages[pages.length - 2];  //上一个页面
	  prevPage.setData({
		  orderExtraServices: orderExtraServices,
		  orderExtraServicesPrice: price
	  })
	  wx.navigateBack({
		  delta: 1
	  })
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
  onShareAppMessage: function () {
  
  }

})