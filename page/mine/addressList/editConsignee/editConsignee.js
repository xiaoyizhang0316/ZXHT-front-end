//editConsignee.js
var COM = require('../../../../utils/common.js')
import WxValidate from "../../../../utils/Validate/WxValidate.js"
var Validate = ""
var app = getApp()
Page({
  data: {
    index: -1,
    addressList: [],
    address: {
      isDefault: false,
      name: '',
      phone: '',
      city: '',
      identityCard: '',
      detail: '',
      correctSidePic: '',
      oppositeSidePic: ''
    },
    region: ['广东省', '广州市', '海珠区'],
  },
  onLoad: function (options) {
    console.log(options)
    var index = options.index;
    var that = this
    wx.getStorage({
      key: 'addressList',
      success: function (res) {
				console.log("------------------------")
				console.log(res.data[index].correctSidePic)
				console.log(res.data[index].oppositeSodePic)
				console.log(res.data[index].correctSidePic != null && res.data[index].oppositeSidePic != null)
				if (res.data[index].correctSidePic !=null && res.data[index].oppositeSidePic != null)
				{
					res.data[index].correctSidePic = COM.load('CON').IMG_BASE + "ID/" + res.data[index].correctSidePic + ".png";
					res.data[index].oppositeSidePic = COM.load('CON').IMG_BASE + "ID/" + res.data[index].oppositeSidePic + ".png";
					console.log(res.data)
				}
        that.setData({
          addressList: res.data,
          index: options.index,
          address: res.data[index]
        })

      }
    })
  },

  //事件处理函数
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'address.city': e.detail.value
    })
  },

  formSubmit(e) {
    const value = e.detail.value;
    console.log(value)
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
    } else {
      this.data.addressList[this.data.index].name = value.name
      this.data.addressList[this.data.index].phone = value.phone
      this.data.addressList[this.data.index].detail = value.detail
      this.data.addressList[this.data.index].city = value.city
      this.data.addressList[this.data.index].identityCard = value.identityCard

      this.setData({
        addressList: this.data.addressList,
      });

      let url = COM.load('CON').SAVE_CONSIGNEE_URL;
      COM.load('NetUtil').netUtil(url, "POST", this.data.addressList[this.data.index], (callback) => { console.log(callback) })

      wx.setStorage({
        key: 'addressList',
        data: this.data.addressList,
        success() {
          wx.navigateBack();
        }
      })

    }
  },

  deleteAddress: function () {
    var self = this
    wx.showModal({
      title: '提示',
      content: '确认要删除吗?',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          self.data.addressList.splice(self.data.index, 1)
          let addressList = wx.getStorageSync('addressList')
          console.log(addressList)
          let consigneeId = addressList[self.data.index].id
          self.setData({
            addressList: self.data.addressList,
          });
          let url = COM.load('CON').DELETE_CONSIGNEE_URL + consigneeId;
          COM.load('NetUtil').netUtil(url, "DELETE", {}, (callback) => {
            console.log(callback)
          }
          ),
            wx.setStorage({
              key: 'addressList',
              data: self.data.addressList,
              success() {
                wx.navigateBack();
              }
            })

        } else {
          // console.log('用户点击取消')
        }

      }
    })
  },
})
