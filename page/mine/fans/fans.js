// page/mine/fans/fans.js
var app = getApp();
var COM = require('../../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    focus: false,
    displayClear: false,
    fansLineList: {},
    fansMap: Object,
    animationData: {},
    showModalStatus: false,
    selectedFan: Object,
    selectedIndex: 0,
    tmp: { 'access': false, 'vipLevel': '1' },
	memo: '',
	searchResult: {},
	vipArray: ["青铜会员-无折扣", "白银会员-9折", "黄金会员-8折", "商铺代理-7折"]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.filterFans();
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
    if (wx.getStorageSync("refreshFansList")) {
      this.filterFans();
      wx.setStorage({
        key: 'refreshFansList',
        data: false,
      })
    }
  },

  filterFans: function () {
    let shopOpenId = app.globalData.openId;
    let url = COM.load('CON').FANS_LIST_URL + shopOpenId;
    COM.load('NetUtil').netUtil(url, "GET", "", (fans) => {
      let fansMap = new Map();
			console.log(fans)
      if (fans != "") {
			
        for (var x in fans) {
          let fan = fans[x];
          let user = fan.user;         
          fansMap.set(user.id,
            {
              "id": user.id,
              "name": user.name,
              "avatarUrl": user.avatarUrl,
              "vipLevel": fan.vipLevel,
              "access" : fan.access,
			  "openId" : user.openId,
			  "deposit": fan.deposit,

            })
        }
        this.setData({
          fansLineList: Array.from(fansMap.values()),
          fansMap: fansMap
        })
      }
    });
  },

  resetDisplay: function (e) {
    this.setData({
      fansLineList: Array.from(this.data.fansMap.values()),
    })
  },


  bindSearch: function (e) {
    var query = e;
    if (e instanceof Object) {
      query = e.detail.value.trim();
    }
    if (query.length === 0) {
      this.resetSearch();
    } else {
      let tmp = [];
      let fansList = Array.from(this.data.fansMap.values());
      for (let i in fansList) {
        if (e instanceof Object) {
          if (fansList[i].name.toLowerCase().indexOf(query.toLowerCase()) > -1) {
            tmp.push(fansList[i]);
          }
        } 
      }
			

      this.setData({
        search: query,
        displayClear: true,
				fansLineList: tmp
      }); 
    }
  },

  //重置搜索
  resetSearch: function (e) {
    this.setData({ search: '', displayClear: false });
    this.resetDisplay();
  }, 
	
//   updateVipLevel: function (e) {
// 		console.log(e.currentTarget)
// 		let self = this;
//     let vipLevel = e.detail.value.trim();
//     if ([0, 1, 2, 3].indexOf(parseInt(vipLevel)) !== -1) {
// 			let targetOpenId = ""
// 			console.log(Array.from(self.data.fansLineList).length)
// 			console.log(Array.from(self.data.fansLineList))		
// 			console.log(self.data.fansLineList)	
// 			console.log(self.data)
// 			for (let i = 0; i < self.data.fansLineList.length; i++) {	
// 				console.log(self.data.fansLineList[i])
// 				if (self.data.fansLineList[i].id == e.currentTarget.dataset.id) {

// 					targetOpenId = self.data.fansLineList[i].openId;
// 					console.log(targetOpenId)
// 				}
// 			}
		
// 			let fan = { "shop_id": app.globalData.openId, "open_id": targetOpenId, "vip_level": vipLevel };
// 			let url = COM.load('CON').FANS_VIP_URL;
// 			COM.load('NetUtil').netUtil(url, 'PUT', fan, function (res) {

// 				for (let i = 0; i < self.data.fansLineList.length; i++) {
// 					if (self.data.fansLineList[i].id == e.currentTarget.dataset.id) {
// 						self.data.fansLineList[i].vipLevel = vipLevel;
// 					}
// 				}
// 				for (let i = 0; i < self.data.searchResult.length; i++) {
// 					if (self.data.searchResult[i].id == e.currentTarget.dataset.id) {
// 						self.data.searchResult[i].vipLevel = vipLevel;
// 					}
// 				}
// 				self.setData({
// 					fansLineList: self.data.fansLineList,
// 					searchResult: self.data.searchResult
// 				});
// 			})
//     }else{
// 			// to do 提示vip只有四个等级
//       console.log("aaaaaaaaaaaaa");
//     }
//   },


//   switchChange: function (e) {
//     let self = this;
// 		let targetOpenId = ""
// 		for (let i = 0; i < self.data.fansLineList.length; i++) {
// 			if (self.data.fansLineList[i].id == e.currentTarget.dataset.id) {
// 				targetOpenId = self.data.fansLineList[i].openId;
// 			}
// 		}
//     if (!e.detail.value) {
// 			let fan = { "shop_id": app.globalData.openId, "open_id": targetOpenId, "access": false };
//       wx.showModal({
//         title: '提示',
//         content: '确认不允许此人进入店铺?',
//         success: function (res) {          
//           if (res.confirm) {
//             fan.access = false
//             let url = COM.load('CON').FANS_ACCESS_URL;
//             COM.load('NetUtil').netUtil(url, 'PUT', fan, function (res) {
             
//               for (let i = 0; i < self.data.fansLineList.length; i++) 
//               {
//                 if (self.data.fansLineList[i].id == e.currentTarget.dataset.id) {
//                   self.data.fansLineList[i].access = false;
//                   }
//               }
//               for (let i = 0; i < self.data.searchResult.length; i++) 
//               {
//                 if (self.data.searchResult[i].id == e.currentTarget.dataset.id) 
//                 {
// 									self.data.searchResult[i].access = false;
//                 }
//               }
//               self.setData({
//                 fansLineList: self.data.fansLineList,
//                 searchResult: self.data.searchResult
//               });
                  
                
//             })
//           } else if (res.cancel) {
//             self.setData({ fansLineList: self.data.fansLineList });
//           }
//         }
//       })
//     } else {
//       //允许进入
// 			let fan = { "shop_id": app.globalData.openId, "open_id": targetOpenId, "access": true };
//       let url = COM.load('CON').FANS_ACCESS_URL;
//       COM.load('NetUtil').netUtil(url, 'PUT', fan, function (res) {
//         for (let i = 0; i < self.data.fansLineList.length; i++) {
//           if (self.data.fansLineList[i].id == e.currentTarget.dataset.id) {
// 						self.data.fansLineList[i].access = true;
//           }
//         }
//         for (let i = 0; i < self.data.searchResult.length; i++) {
//           if (self.data.searchResult[i].id == e.currentTarget.dataset.id) {
// 						self.data.searchResult[i].access = true;
//           }
//         }
//         // self.data.fansLineList[e.currentTarget.dataset.id -1].selected = true;
//         // self.data.searchResult[e.currentTarget.dataset.id - 1].selected = true;
//         self.setData({
//           fansLineList: self.data.fansLineList,
//           searchResult: self.data.searchResult
//         });
    
        
//       })
//     };
//     //once something changed should force refresh fans list page
//     wx.setStorage({
//       key: 'refreshFansList',
//       data: true,
//     })
//   },
  // saveFan: function () {
  //   let self = this, url = COM.load('CON').SHOP_Fan_URL + '/saveOrUpdate';
  //   if (self.data.tmp && self.data.tmp.price) {
  //     self.setData({ 'selectedFan.price': self.data.tmp.price });
  //   }
  //   if (self.data.tmp && self.data.tmp.vipPrice) {
  //     self.setData({ 'selectedFan.vipPrice': self.data.tmp.vipPrice });
  //   }

  //   COM.load('NetUtil').netUtil(url, 'POST', self.data.selectedFan, function (res) {
  //     wx.showToast({
  //       title: '数据更新成功',
  //       success: function () {
  //         self.data.fansMap.set(self.data.selectedFan.FanId, self.data.selectedFan);
  //         for (let x in self.data.fansLineList) {
  //           if (self.data.fansLineList[x].FanId == self.data.selectedFan.FanId) {
  //             self.data.fansLineList[x] = self.data.selectedFan;
  //             break;
  //           }
  //         }
  //         self.setData({
  //           fansLineList: self.data.fansLineList,
  //           fansMap: self.data.fansMap,
  //           tmp: Object
  //         });

  //         self.hideModal();
  //       }
  //     })
  //   })
  // },

  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  share: function (event) {
    wx.navigateTo({
      url: '/page/mine/fans/share/share'
    })
  },

  editFan: function(e)
  {
	  let self = this
	 
	  let fan = self.data.fansLineList[e.currentTarget.dataset.id]
	  self.setData({
		  
		  selectedFan: fan
	  });
	  wx.navigateTo({
		  url: '/page/mine/fans/editFans/editFans',
	  })
	
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

  
})