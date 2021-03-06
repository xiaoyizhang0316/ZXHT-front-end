//addressList.js
var COM = require('../../../utils/common.js')
var app = getApp();
Page({
  action: '',
  returnPage: 1,
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
				console.log(this.data.addressList[index])
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
          //目前用缓存，需要修改-Edric
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
	  let self = this
	  let url = "consignee/consignee?returnPage="+self.data.returnPage
    wx.navigateTo({
      url: url,
      //接口调用成功的回调方法
      fuccess: function () {
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
	if(param.returnPage)
	{
		this.setData({
			returnPage: param.returnPage
		})
	}
	
    console.log(this.data.action)
  },
  onShow: function (param) {
    
		let self = this
		let url = COM.load('CON').GET_MY_CONSIGNEES_URL + app.globalData.openId
		COM.load('NetUtil').netUtil(url, "GET", "", (callbackdata) => {
			wx.setStorage({
				key: "addressList",
				data: callbackdata,
				success: function (res) {
					self.setData({
						addressList: callbackdata
					})
				}
			})
		})
   
  },
	onPullDownRefresh: function(e)
	{
		
		let self = this
		let url = COM.load('CON').GET_MY_CONSIGNEES_URL + app.globalData.openId
		COM.load('NetUtil').netUtil(url, "GET", "", (callbackdata) => {
			wx.setStorage({
				key: "addressList",
				data: callbackdata,
				success:function(res){
					wx.stopPullDownRefresh()
					self.onShow()

				}
			})
		})
	},

})
