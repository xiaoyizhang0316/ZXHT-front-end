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
    city: null,
	payments:[],
	shipAgents:[],
	shopParams:[],
	deposit:0
  },

  onLaunch: function (e) {

    var self = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log('App Launch at: ' + timestamp);

    //检查缓存
    wx.getStorage(
      {
        key: "openId",
        success(res) {
          self.globalData.openId = res.data
          self.globalData.shopId = wx.getStorageSync('shopId')
		  self.globalData.nickName = wx.getStorageSync('nickname') ? wx.getStorageSync('nickname') : null
          self.globalData.shopOpened = wx.getStorageSync('shopOpened')
          self.globalData.userId = wx.getStorageSync('userId')
          self.globalData.avatarUrl = wx.getStorageSync('avatarUrl')
          self.globalData.targetShopId = wx.getStorageSync('targetShopId')
          self.globalData.addressList = wx.getStorageSync("addressList")
        },
        fail() {
				
          wx.login({
						
            success: function (res) {
							console.log("login ok")
              self.setuserinfo(res.code)
              
            },
						fail: function (res){
							console.log(res)
						}
          })
        }
      })
  },



  //使用授权code获得并储存openid与nickname
  setuserinfo: function (code) {

		var self = this

		//然后访问后台得到用户开店信息
		//访问后端获取openid
		let url = COM.load('CON').tryCode_URL + code;
		//let url = "https://a5f93900.ngrok.io/api/mall/test/appid/" + code
		COM.load('NetUtil').netUtil(url, "GET", "", (openId) => {
			self.globalData.openId = self.jsonToMap(openId).get("openid")
      console.log("haha")
      self.getAddressList(self.globalData.openId)
			//储存用户信息
			// if (self.globalData.userId == false) {
			// 	//访问微信获取nickname
			// 	wx.getUserInfo({
			// 		withCredentials: false,
			// 		lang: '',
			// 		success: function (res) {
			// 			self.globalData.nickName = res.userInfo.nickName
			// 			self.globalData.avatarUrl = res.userInfo.avatarUrl
			// 			wx.setStorage({
			// 				key: 'nickname',
			// 				data: self.globalData.nickName
			// 			})
			// 			wx.setStorage({
			// 				key: 'avatarUrl',
			// 				data: self.globalData.avatarUrl
			// 			})
			// 			self.saveOrUserData(res.userInfo)
			// 		},
			// 		fail: function (res) { },
			// 		complete: function (res) { },
			// 	})
				
			// }
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

  },

  //用户登录后把用户储存在user表里, 把用户是否注册状态存入缓存
//   saveOrUserData: function (userInfo) {
//     var self = this

   
// 		let url = COM.load('CON').CREATE_OR_UPDATE_USER;
// 		COM.load('NetUtil').netUtil(url, "POST", { "open_id": self.globalData.openId, "name": userInfo.nickName, "avatarUrl": userInfo.avatarUrl, "country":userInfo.country, "province": userInfo.province,	"city": userInfo.city }, (callback) => {

//       wx.setStorage({
//         key: 'userId',
//         data: callback,
//       })
//     })
//   },
 
  //设定用户是否开过店以及商店ID
  setShopisOpenedOrNot: function (openId) {
    var self = this
    
    let url = COM.load('CON').shopisOpenOrNot+openId;
    COM.load('NetUtil').netUtil(url, "GET", "", (callbackdata) => {
			console.log('--------------------------------------------------------------------------------------++')
			console.log(callbackdata)
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

  getAddressList: function(openId){
    let self = this
    let url = COM.load('CON').GET_MY_CONSIGNEES_URL + openId
    COM.load('NetUtil').netUtil(url, "GET", "", (callbackdata) => {
      wx.setStorage({
        key: "addressList",
        data: callbackdata
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
