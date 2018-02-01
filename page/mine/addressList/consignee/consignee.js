//consignee.js
var COM = require('../../../../utils/common.js')
var app = getApp()
Page({
  data: {
    addressList: [],
    address: {
      id:'',
      isDefault: false,
      name: '',
      phone: '',
      city: '',
      identityCard: '',
      detail: '',
      correctSidePic: 0,
      oppositeSidePic: 0
    },
    middleInfo: '海关政策要求，请正确填写收货人身份证并上传身份证的正反面照片。加密保存，仅用于海关清关',
    region: ['广东省', '广州市', '海珠区'],
  },
  //事件处理函数
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'address.city': e.detail.value
    })
  },

  formSubmit(e) {
    let self = this
    const value = e.detail.value;
    // if (value.name && value.phone && value.detail && value.city && value.identityCard && value.correctSidePic && value.oppositeSidePic) {
    if (value.name && value.phone && value.detail && value.city && value.identityCard) {
      this.data.address.name = value.name
      this.data.address.phone = value.phone
      this.data.address.detail = value.detail
      this.data.address.city = value.city
      this.data.address.identityCard = value.identityCard
      
      
			let aData = this.data.address
			aData.openId = app.globalData.openId
			//发送地址到服务器
			let url = COM.load('CON').SAVE_CONSIGNEE_URL;
			COM.load('NetUtil').netUtil(url, "POST", aData, (callback) => {
					if(callback.suc == true)
					{
            console.log(callback.id)
            self.data.address.id = callback.id
            var newarray = [this.data.address]
            this.setData({
              'addressList': this.data.addressList.concat(newarray)
            });
            wx.setStorage({
              key: 'addressList',
              data: this.data.addressList,
              success() {
                wx.navigateBack();
              }
            })
						// let cData = [
						// 	{
						// 		"id": consignee_id,
						// 		"table": "consignee",
						// 		"name": "correctSidePic",
						// 		"file": this.data.address.correctSidePic
						// 	},
						// 	{
						// 		"id": consignee_id,
						// 		"table": "consignee",
						// 		"name": "oppositeSidePic",
						// 		"file": this.data.address.oppositeSidePic
						// 	}
						// 	]					
						// let url = COM.load("CON").UPLOADFILE;
						// COM.load('NetUtil').netUtil(url, "POST", cData, (res) => {
						// 	console.log(res);

						// })
					}
				})
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }
  },

  //正面照片事件
  chooseCorrectPic: function (e) {
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['album', 'camera'],
    //   success: function (res) {

    //   }
    // })
		
    wx.navigateTo({
      url: "./upload/uploadImg?from=address.correctSidePic",
    })
  },

  //背面照片事件
  chooseOppositePic: function (e) {
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['album', 'camera'],
    //   success: function (res) {

    //   }
    // })
    wx.navigateTo({
      url: "./upload/uploadImg?from=address.oppositeSidePic",
    })
  },

  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'addressList',
      success: function (res) {
        that.setData({
          addressList: res.data
        })
        
      }
    })
  }
})
