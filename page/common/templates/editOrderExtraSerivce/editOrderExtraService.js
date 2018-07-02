// page/common/templates/editOrderExtraSerivce/editOrderExtraService.js
var COM = require('../../../../utils/common.js');
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tipHide: false,
        chooseTypeHide: true,
        chooseImage: [],
        chooseVideo: '',
        playVideo: false,
        message: '',
        orderExtraServiceId: '',
        buttonFlag: true

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; //上一个页面
        let self = this
        let orderExtraService = prevPage.data.order.orderExtraServices[options.id];
        let orderExtraServiceId = orderExtraService.id
        this.setData({
            orderExtraServiceId: orderExtraServiceId
        })



    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function(res) {
        this.videoContext = wx.createVideoContext('prew_video');
    },
    /**
     * 选择上传类型
     */
    chooseType: 3,
    bindChooseType: function(e) {
        var thisType = e.currentTarget.dataset.type;
        if (thisType != 3) {
            this.chooseType = thisType;
            // 选择类型之后再次调用选择上传文件
            this.bindChooseMedia();
        }
        this.setData({
            chooseTypeHide: true
        });
    },
    /**
     * 选择上传文件
     */
    bindChooseMedia: function(e) {
        let this_ = this
        wx.showModal({
            title: '提示',
            content: '请选择上传类型',
            cancelText: '上传视频',
            cancelColor: '#3CC51F',
            confirmText: '上传图片',
            success: function(res) {
                if (res.confirm) {
                    // 图片
                    console.log('图片')

                    var haveImage = this_.data.chooseImage;
                    wx.chooseImage({
                        count: 9 - haveImage.length, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function(res) {

                            var tempFilePaths = res.tempFilePaths;
                            console.log(tempFilePaths)
                            this_.setData({
                                chooseImage: haveImage.concat(tempFilePaths),
                                chooseVideo: ''
                            })
                        }
                    })

                } else if (res.cancel) {
                    // 视频
                    console.log('视频')
                    wx.chooseVideo({
                        sourceType: ['album', 'camera'],
                        maxDuration: 60,
                        camera: 'back',
                        success: function(res) {
                            console.log(res.tempFilePath)
                            this_.setData({

                                chooseImage: [],

                                chooseVideo: res.tempFilePath
                            })
                        }
                    })

                }
            },
        })

    },
    /**
     * 删除图片
     */
    bindDeleteImage: function(e) {
        var thisIndex = e.currentTarget.dataset.index;
        var allImage = this.data.chooseImage;
        allImage.splice(thisIndex, 1);
        this.setData({
            chooseImage: allImage
        })
    },
    /**
     * 删除视频
     */
    bindDeleteVideo: function(e) {
        this.setData({
            chooseVideo: ''
        })
    },
    /**
     * 预览图片
     */
    bindPreviewImage: function(e) {
        console.log(e)
        var curData = e.currentTarget.dataset;
        wx.previewImage({
            current: curData.current,
            urls: curData.group
        })
    },
    /**
     * 预览视频
     */
    bindPreviewVideo: function(e) {
        var videoContext = this.videoContext;
        videoContext.seek(0);
        videoContext.play();
        videoContext.requestFullScreen();
    },
    /**
     * 全屏改变
     */
    bindVideoScreenChange: function(e) {
        var status = e.detail.fullScreen;
        var play = {
            playVideo: false
        }
        if (status) {
            play.playVideo = true;
        } else {
            this.videoContext.pause();
        }
        this.setData(play);
    },
    submitForm: function(e) {
        this.setData({
            buttonFlag: false
        })
        let self = this
        console.log(this.data)
        console.log(e)
        let message = e.detail.value.textarea;
		if(message != '')
		{
			let url = COM.load('CON').ORDER_EXTRA_SERVICE_MESSAGE;
			COM.load('NetUtil').netUtil(url, "POST", { "message": message, "orderExtraServiceId": self.data.orderExtraServiceId }, (callback) => {
				if(callback == true)
				{					
					self.upload()

				}else{
					wx.showModal({
						title: '提示',
						content: '更新失败,请重新尝试',
						showCancel: false,
						
					})
				}

			}) 
		}else{
			self.upload()
		}
		

    },
	upload: function(){
		let self = this
		//上传图片
		if (self.data.chooseImage.length > 0) {

			let cData = []
			for (var i = 0; i < self.data.chooseImage.length; i++) {
				cData.push({
					"id": self.data.orderExtraServiceId,
					"table": "orderExtraService",
					"name": "images",
					"file": self.data.chooseImage[i]
				})

			}

			//上传图片
			console.log("img data here")
			console.log(cData)
			let url = COM.load("CON").UPLOADFILE;
			COM.load('NetUtil').uploadFile(url, "POST", cData, (callback) => {
				console.log(callback)

				console.log("ppppppppppppppppppppppppppppppppppppppp")
				if (callback == 'done') {
					wx.showToast({
						title: '上传成功',
						icon: 'success',
						duration: 1500,
						success: function (res) {
							self.setData({
								'buttonFlag': false
							})

							wx.navigateBack({
								delta: 1
							})



							// wx.redirectTo({
							// 	url: '/page/mine/addressList/addressList?action=selectOne',
							// })
						}
					})


				} else {
					wx.showToast({
						title: '上传失败,请重新尝试',

						icon: 'fail',
						duration: 1500,
						success: function (res) {
							self.setData({
								'buttonFlag': false
							})
							// wx.redirectTo({
							// 	url: '/page/mine/addressList/addressList?action=selectOne',
							// })
						}
					})


				}

			})
		} else if (self.data.chooseVideo != '') {
			//上传视频
			let cData = []
			cData.push({
				"id": self.data.orderExtraServiceId,
				"table": "orderExtraService",
				"name": "video",
				"file": self.data.chooseVideo
			})
			let url = COM.load("CON").UPLOADFILE;
			COM.load('NetUtil').uploadFile(url, "POST", cData, (callback) => {
				console.log(callback)

				console.log("ppppppppppppppppppppppppppppppppppppppp")
				if (callback == 'done') {
					wx.showToast({
						title: '上传成功',
						icon: 'success',
						duration: 1500,
						success: function (res) {
							self.setData({
								'buttonFlag': false
							})

							wx.navigateBack({
								delta: 1
							})



							// wx.redirectTo({
							// 	url: '/page/mine/addressList/addressList?action=selectOne',
							// })
						}
					})


				} else {
					wx.showToast({
						title: '上传失败,请重新尝试',

						icon: 'fail',
						duration: 1500,
						success: function (res) {
							self.setData({
								'buttonFlag': false
							})
							// wx.redirectTo({
							// 	url: '/page/mine/addressList/addressList?action=selectOne',
							// })
						}
					})


				}

			})


		}
	},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})