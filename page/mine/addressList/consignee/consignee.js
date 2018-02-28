//consignee.js
var COM = require('../../../../utils/common.js')
import WxValidate from "../../../../utils/Validate/WxValidate.js"
var Validate = ""
var app = getApp()
Page({
  data: {
    addressList: [],
    address: {
      id: '',
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

    // 验证字段的规则
    // const rules = {
    //   name: {
    //     required: true,
    //     name: true
    //   },
    //   phone: {
    //     required: true,
    //     tel: true,
    //   },
    //   identityCard: {
    //     required: true,
    //     idcard: true
    //   },
    //   detail: {
    //     required: true
    //   },
    //   city: {
    //     required: true
    //   }
    // }

    // 验证字段的提示信息，若不传则调用默认的信息
    // const messages = {
    //   name: {
    //     required: '请输入姓名',
    //     name: '请输入正确的姓名'
    //   },
    //   phone: {
    //     required: '请输入手机号',
    //     tel: '请输入正确的手机号',
    //   },
    //   identityCard: {
    //     required: '请输入身份证号码',
    //     idcard: '请输入正确的身份证号码',
    //   },
    //   detail: {
    //     required: '请输入完整地址信息'
    //   },
    //   city:{
    //     required: '请输入地址信息'
    //   }
    // }
    // 创建实例对象
   // this.WxValidate = new WxValidate(rules, messages)

    console.log(e)
    // 传入表单数据，调用验证方法
    // 
		if(false){}
    else {
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
        if (callback.suc == true) {
          console.log(callback.id)
          self.data.address.id = callback.id
          var newarray = [this.data.address]
          this.setData({
            'addressList': this.data.addressList.concat(newarray)
          });
					let consignee_id = callback.id
					let cData = [
						{
							"id": consignee_id,
							"table": "consignee",
							"name": "correctSidePic",
							"file": this.data.address.correctSidePic
						},
						{
							"id": consignee_id,
							"table": "consignee",
							"name": "oppositeSidePic",
							"file": this.data.address.oppositeSidePic
						}
					]
					console.log("img data here")
					console.log(cData)
					let url = COM.load("CON").UPLOADFILE;
					COM.load('NetUtil').uploadFile(url, "POST", cData, (callback) => {
					console.log(callback)
					})
					return
          wx.setStorage({
            key: 'addressList',
            data: this.data.addressList,
            success() {
              wx.navigateBack();
            }
          })
         
         
        }
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
