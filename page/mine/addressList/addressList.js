//addressList.js
var COM = require('../../../utils/common.js')
Page({
  action: '',
  data: {
    addressList: [
    ],
    inputRegion: '',
  },
  //事件处理函数
  selectOne: function (e) {
    if (this.data.action == 'selectOne') {
      console.log('selectOne!')
      const index = e.currentTarget.dataset.index;
      console.log(index)
      //获取页面栈
      var pages = getCurrentPages();
      if (pages.length > 1) {

        //上一个页面实例对象
        var prevPage = pages[pages.length - 2];

        //更新上个页面的address数据
        prevPage.setData({
          address: this.data.addressList[index]
        })

        wx.navigateBack(); 
      }

    }else{
      console.log('action is not selectOne!')
    }


  },
  setDefault: function(e) {
    console.log(e)
    var self = this
    wx.showModal({
      title: '提示',
      content: '确认要设置为默认吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          //获取点击项的索引值
          const index = e.currentTarget.dataset.index;

          //遍历设置isDefault为false
          const length = self.data.addressList.length
          console.log(self.data.addressList)
          for (let i = 0; i < length; i++) {
            self.data.addressList[i].isDefault = false;
          }

          self.data.addressList[index].isDefault = true;

          //设置后端默认地址
          let adList = wx.getStorageSync("addressList")
          let url = COM.load('CON').SET_DEFAULT_CONSIGNEE_URL + adList[index].id;
          COM.load('NetUtil').netUtil(url, "PUT", {}, (callback) => {})

          self.setData({
            addressList: self.data.addressList
          })
          wx.setStorage({
            key: 'addressList',
            data: self.data.addressList,
            success() {
              console.log('success')
            }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  addConsignee: function (event) {
    wx.navigateTo({
      url: "consignee/consignee",
      //接口调用成功的回调方法
      success: function () {
        console.log('succ')
        // wx.showToast({
        //   title: '添加成功',
        //   icon: 'success',
        //   duration: 1000
        // }) 
      },
      fail:function () { },
      complete:function () { }
   })
  },

  onLoad: function(param) {
    console.log(param)

    this.setData({
      action: param.action
    })
    console.log(this.data.action)
  },
  onShow: function (param) {
    var that = this
    wx.getStorage({
      key: 'addressList',
      success: function (res) {
        that.setData({
          addressList: res.data
        })
        // console.log(res.data)
      }
    })
  }
})
