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
    targetShopId: null
  },

  onLaunch: function (e) {
    var self = this
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log('App Launch at: ' + timestamp)

    if (e.query.targetShopId != null) {
      self.globalData.targetShopId = e.query.targetShopId
    }

    console.log("targetShopId:" + self.globalData.targetShopId)
    wx.getStorage(
      {
        key: "openId",
        success(res) {
          self.globalData.openId = res.data
        },
        fail() {
          wx.login({
            success: function (res) {
              self.setuserinfo(res.code)
            }
          })
        }
      })
    self.globalData.shopId = wx.getStorageSync('shopId')
    self.globalData.nickName = wx.getStorageSync('nickname')
    self.globalData.shopOpened = wx.getStorageSync('shopOpened')
    self.globalData.userId = wx.getStorageSync('userId')
    self.globalData.avatarUrl = wx.getStorageSync('avatarUrl')
    console.log(self.globalData)
  },
  //使用授权code获得并储存openid与nickname
  setuserinfo: function (code) {
    var self = this

    //访问微信获取nickname
    wx.getUserInfo({
      withCredentials: false,
      lang: '',
      success: function (res) {
        console.log("nickname: " + res.userInfo.nickName)
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

        //然后访问后台得到用户开店信息
        //访问后端获取openid
        // let url = COM.load('CON').tryCode_URL + code;
        let url = "https://a5f93900.ngrok.io/api/mall/test/appid/" + code
        COM.load('NetUtil').netUtil(url, "GET", "", (openId) => {
          self.globalData.openId = self.jsonToMap(openId).get("openid")

          //储存用户信息
          if (self.globalData.userId == false) {
            self.saveOrUserData()
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

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //用户登录后把用户储存在user表里, 把用户是否注册状态存入缓存
  saveOrUserData: function () {
    var self = this
    let url = "https://a5f93900.ngrok.io/api/mall/users/saveOrUpdateUserData"
    // let url = COM.load('CON').tryAddUser_URL;
    wx.getUserInfo({
      success: function (res) {
        let avatarUrl = res.userInfo.avatarUrl
        let country = res.userInfo.country
        let province = res.userInfo.province
        let city = res.userInfo.city
        COM.load('NetUtil').netUtil(url, "POST", { "open_id": self.globalData.openId, "name": self.globalData.nickName, "avatarUrl": avatarUrl, "country": country, "province": province, "city": city }, (callback) => {
          wx.setStorage({
            key: 'userId',
            data: callback,
          })
        })
      }
    })
  },

  //设定用户是否开过店以及商店ID
  setShopisOpenedOrNot: function (openId) {
    var self = this
    let url = "https://a5f93900.ngrok.io/api/mall/shops/checkOpenShop/" + openId
    // let url = COM.load('CON').shopisOpenOrNot;
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
