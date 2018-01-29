// var WXBizDataCrypt=require('utils/cryptojs/RdWXBizDataCrypt.js')
// var AppId = 
// var AppSecret = 

var COM = require('utils/common.js')
App({

  globalData: {
    userId: false,
    openId: null,
    nickName: null,
    shopOpened: null,
    shopId: null,
    avatarUrl: null,
    targetShopId: null,
    country: null,
    provice: null,
    city: null
  },

  onLaunch: function (e) {

    var self = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log('App Launch at: ' + timestamp)
    //检查缓存
    wx.getStorage(
      {
        key: "openId",
        success(res) {
          self.globalData.openId = res.data
          self.globalData.shopId = wx.getStorageSync('shopId')
          self.globalData.nickName = wx.getStorageSync('nickname')
          self.globalData.shopOpened = wx.getStorageSync('shopOpened')
          self.globalData.userId = wx.getStorageSync('userId')
          self.globalData.avatarUrl = wx.getStorageSync('avatarUrl')
          self.globalData.targetShopId = wx.getStorageSync('targetShopId')
        },
        fail() {
          wx.login({
            success: function (res) {
              self.setuserinfo(res.code)
            }
          })
        }
      })
  },



  //使用授权code获得并储存openid与nickname
  setuserinfo: function (code) {
<<<<<<< HEAD
		var self = this

		//然后访问后台得到用户开店信息
		//访问后端获取openid
		let url = COM.load('CON').tryCode_URL + code;
		//let url = "https://a5f93900.ngrok.io/api/mall/test/appid/" + code
		COM.load('NetUtil').netUtil(url, "GET", "", (openId) => {
			self.globalData.openId = self.jsonToMap(openId).get("openid")

			//储存用户信息
			if (self.globalData.userId == false) {
				//访问微信获取nickname
				wx.getUserInfo({
					withCredentials: false,
					lang: '',
					success: function (res) {
						self.globalData.nickName = res.userInfo.nickName
						self.globalData.avatarUrl = res.userInfo.avatarUrl
						wx.setStorage({
							key: 'nickname',
							data: self.globalData.nickName
						})
						wx.setStorage({
							key: 'avatarUrl',
							data: self.globalData.avatarUrl
						})
						self.saveOrUserData(res.userInfo)
					},
					fail: function (res) { },
					complete: function (res) { },
				})
				
			}
			//查看并设定用户是否开过店
			self.setShopisOpenedOrNot(self.globalData.openId)

			//把openId存入缓存
			wx.setStorage(
				{
					key: "openId",
					data: self.globalData.openId
				}
			)

		})
    
    
=======
    var self = this

    //然后访问后台得到用户开店信息
    //访问后端获取openid
    // let url = COM.load('CON').tryCode_URL + code;
    let url = "https://a5f93900.ngrok.io/api/mall/test/appid/" + code
    COM.load('NetUtil').netUtil(url, "GET", "", (openId) => {
      self.globalData.openId = self.jsonToMap(openId).get("openid")

      //储存用户信息
      if (self.globalData.userId == false) {
        //访问微信获取nickname
        wx.getUserInfo({
          withCredentials: false,
          lang: '',
          success: function (res) {
            self.globalData.nickName = res.userInfo.nickName
            self.globalData.avatarUrl = res.userInfo.avatarUrl
            wx.setStorage({
              key: 'nickname',
              data: self.globalData.nickName
            })
            wx.setStorage({
              key: 'avatarUrl',
              data: self.globalData.avatarUrl
            })
            self.saveOrUserData(res.userInfo)
          },
          fail: function (res) { },
          complete: function (res) { },
        })

      }
      //查看并设定用户是否开过店
      self.setShopisOpenedOrNot(self.globalData.openId)

      //把openId存入缓存
      wx.setStorage(
        {
          key: "openId",
          data: self.globalData.openId
        }
      )

    })


>>>>>>> 0311ea371245be68aa5e79ef94a0aadf0e1712b8
  },

  //用户登录后把用户储存在user表里, 把用户是否注册状态存入缓存
  saveOrUserData: function (userInfo) {
    var self = this
<<<<<<< HEAD
    //let url = "https://a5f93900.ngrok.io/api/mall/users/saveOrUpdateUserData"
		let url = COM.load('CON').CREATE_OR_UPDATE_USER;
		COM.load('NetUtil').netUtil(url, "POST", { "open_id": self.globalData.openId, "name": userInfo.nickName, "avatarUrl": userInfo.avatarUrl, "country":userInfo.country, "province": userInfo.province,	"city": userInfo.city }, (callback) => {
=======
    let url = "https://a5f93900.ngrok.io/api/mall/users/saveOrUpdateUserData"
    // let url = COM.load('CON').tryAddUser_URL;
    COM.load('NetUtil').netUtil(url, "POST", { "open_id": self.globalData.openId, "name": userInfo.nickName, "avatarUrl": userInfo.avatarUrl, "country": userInfo.country, "province": userInfo.province, "city": userInfo.city }, (callback) => {
>>>>>>> 0311ea371245be68aa5e79ef94a0aadf0e1712b8
      wx.setStorage({
        key: 'userId',
        data: callback,
      })
    })
  },

  //设定用户是否开过店以及商店ID
  setShopisOpenedOrNot: function (openId) {
    var self = this
    //let url = "https://a5f93900.ngrok.io/api/mall/shops/checkOpenShop/" + openId
    let url = COM.load('CON').shopisOpenOrNot+openId;
    COM.load('NetUtil').netUtil(url, "GET", "", (callbackdata) => {
      if (callbackdata == 0) {
        self.globalData.shopOpened = false
      } else {
        self.globalData.shopOpened = true
        self.globalData.shopId = callbackdata
        //储存shopID进缓存
        wx.setStorage({
          key: 'shopId',
          data: self.globalData.shopId,
        })
      }
      wx.setStorage({
        key: 'shopOpened',
        data: self.globalData.shopOpened
      })
    })
  },

  jsonToMap: function (jsonStr) {
    return this.objToStrMap(JSON.parse(jsonStr));
  },
  objToStrMap: function (obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  },

  onShow: function () {
    console.log('App Show')
		
    
  },
  onHide: function () {
    console.log('App Hide')
  }
})
