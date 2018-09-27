
var COM = require('../../../utils/common.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        focus: false,
        param: '',
        isShowTitleList: false,
        isShowHistory: false,
        searchTitleList: [],
        searchHistoryList: [],
        searchResultIds: [],

        searchHotList: [{
            name: '蔓越莓',
        }, {
            name: '葡萄籽',
        }, ],
    },

    cleanHistory: function(e) {
        this.setData({
            isShowHistory: false,
            searchHistoryList: []
        })

        wx.setStorage({
            key: "searchHistoryList",
            data: this.data.searchHistoryList,
        })

    },

    changeHot: function(e) {
        wx.showToast({
            title: '换一批被触发',
            icon: 'success',
            duration: 1000
        })
    },

    writeQuery: function(e) {
        this.setData({
            param: e.currentTarget.dataset.name
        })
        this.searchTitleRequest(this.data.param);
    },


    //转跳详情页
    showDetail: function(e) {
        var id = e.currentTarget.dataset.id
        var name = e.currentTarget.dataset.name
        this.addSearchHistoryItem(name)
        wx.navigateTo({
            url: '/page/details/details?id=' + id
        })

    },

    addSearchHistoryItem: function(param) {
        //param = COM.load('Util').trimAll(param);
        //目前searchHistoryList中只存title
        var searchHistoryList = this.data.searchHistoryList
        for (var x in searchHistoryList) {
            if (searchHistoryList[x].name == param) {
                searchHistoryList.splice(x, 1)
                break;
            }
        }

       
        var newItem = {
            name: param
        }

        searchHistoryList.push(newItem);

        //remove the duplicated record
        searchHistoryList = searchHistoryList.filter(function(item, pos) {
            return searchHistoryList.indexOf(item) == pos;
        });
		//限制搜索记录为10个
		while (searchHistoryList.length >= 10) {
			searchHistoryList.shift()
		}

        this.setData({
            isShowHistory: true,
            searchHistoryList: searchHistoryList
        })

        wx.setStorage({
            key: "searchHistoryList",
            data: searchHistoryList,
        })
    },

    //点击清除按钮
    clearTitle: function(e) {
        this.setData({
            searchTitleList: [],
            param: '',
            isShowTitleList: false
        })
    },

    //监听键盘输入
    onKeyUp: function(e) {

        this.setData({
            param: e.detail.value
        })

        var query = this.data.param

        if (query) {
            this.searchTitleRequest(query)
        } else {
            this.setData({
                searchTitleList: [],
                isShowTitleList: false,
				
            })
            console.log('query is empty')
        }

    },

    //发送关键字搜索请求
    searchTitleRequest: function(query) {
        var self = this;
		
        //NetUtil.netUtil
        //COM.util('NetUtil').netUtil
		query = query.toUpperCase();
		
		let shopProducts = wx.getStorageSync("shopProducts")
		let fliteredTitleList = [];
		if (Object.keys(shopProducts).length > 0)
		{
			for(var key in shopProducts)
			{
				let sp = shopProducts[key]
				
				if (query.split(" ").every(q => sp.title.toUpperCase().includes(q)))
				{
					fliteredTitleList.push({
						"id": sp.id,
						"title": sp.title,
						"price": sp.vipPrice,						
						"sales": sp.sales,
						"image": COM.load('Util').image(sp.barcode),
					});
					delete shopProducts.key;
					
					continue;
				}
			}
			for (var key in shopProducts) {
				let sp = shopProducts[key]

				if (query.split(" ").some(q => sp.title.toUpperCase().includes(q))) {
					fliteredTitleList.push({
						"id": sp.id,
						"title": sp.title,
						"price": sp.vipPrice,
						"sales": sp.sales,
						"image": COM.load('Util').image(sp.barcode),
					});
					
					continue;
				}
			}

			if(fliteredTitleList.length>0)
			{
				self.setData({
					searchTitleList: fliteredTitleList,
					isShowTitleList: true
				})
				self.addSearchHistoryItem(query)
			}else{
				self.setData({
					searchTitleList: [],
					isShowTitleList: true
				})
			}
		}
        // COM.load('NetUtil').netUtil(COM.load('CON').SEARCH_URL + query, "GET", "", function(res) {
        //     var searchResultIds = []; //保存搜索产品的id, 用于详细页面的输入值
        //     if (res) {
        //         let fliteredTitleList = []; //只收录该店铺的商品
        //         let shopProductIds = wx.getStorageSync("shopProductIds");
        //         console.log("-----------------------------------------")
        //         console.log(res)
        //         for (let i = 0; i < res.length; i++) {
        //             if (shopProductIds.indexOf(res[i].id) > -1) { //只搜索该店铺上架商品,过滤掉未上架商品
        //                 res[i].rendered = [];
        //                 searchResultIds.push(res[i].id);
        //                 fliteredTitleList.push(res[i]);
        //                 var current_word = res[i].title;
        //                 if (current_word.indexOf(query) > -1) {
        //                     res[i].rendered = self.hilight_word(query, current_word)
        //                 }
        //             }
        //         }
        //         console.log("-----------------------------------------")
        //         console.log(fliteredTitleList)
        //         self.setData({
        //             searchTitleList: fliteredTitleList,
        //             isShowTitleList: true,
        //             searchResultIds: searchResultIds,
        //         })

        //     } else {
        //         self.setData({
        //             searchTitleList: [],
        //             isShowTitleList: true
        //         })
        //     }
        // });

    },

    //关键词高亮
    hilight_word: function(key, word) {
        let idx = word.indexOf(key);
        let t = [];
        if (idx > -1) {
            if (idx == 0) {
                t = this.hilight_word(key, word.substr(key.length));
                t.unshift({
                    key: true,
                    str: key
                });
                return t;
            }
            if (idx > 0) {
                t = this.hilight_word(key, word.substr(idx));
                t.unshift({
                    key: false,
                    str: word.substring(0, idx)
                });
                return t;
            }
        }
        return [{
            key: false,
            str: word
        }];
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        var self = this
		

        self.setData({
            focus: true
        })
		
		if (Object.prototype.toString.call(e) !== '[object Undefined]' && Object.prototype.toString.call(e.param) !== '[object Undefined]')
		{
			self.setData({
				param: e.param
			})
			self.searchTitleRequest(e.param)
		}else{
			wx.getStorage({
				key: 'searchHistoryList',
				success: function (res) {
					if (res.data.length > 0) {
						self.setData({
							isShowHistory: true,
							searchHistoryList: res.data,
						})
					} else {
						self.setData({
							searchHistoryList: [],
						})
					}

				}
			})

		}
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(e) {
	
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

})