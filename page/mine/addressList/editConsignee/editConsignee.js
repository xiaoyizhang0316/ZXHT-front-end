//editConsignee.js
var COM = require('../../../../utils/common.js')
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

    if (value.name && value.phone && value.detail && value.city) {
      this.data.addressList[this.data.index].name = value.name
      this.data.addressList[this.data.index].phone = value.phone
      this.data.addressList[this.data.index].detail = value.detail
      this.data.addressList[this.data.index].city = value.city
      this.data.addressList[this.data.index].identityCard = value.identityCard

      this.setData({
        addressList: this.data.addressList,
      });

      let url = COM.load('CON').SAVE_CONSIGNEE_URL;
      COM.load('NetUtil').netUtil(url, "POST", this.data.addressList[this.data.index], (callback) => {})

      wx.setStorage({
        key: 'addressList',
        data: this.data.addressList,
        success() {
          wx.navigateBack();
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
  onLoad: function (options) {
    console.log(options)
    var index = options.index;
    var that = this
    wx.getStorage({
      key: 'addressList',
      success: function (res) {
        that.setData({
          addressList: res.data,
          index: options.index,
          address: res.data[index]
        })

      }
    })
  }
})
