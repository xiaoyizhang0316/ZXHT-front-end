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
		imagesIndex:[],
        chooseVideo: '',
        playVideo: false,
        message: '',
        orderExtraServiceId: '',
        buttonFlag: true,
		edit: false,
		message:""

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; //上一个页面
        let self = this
		let orderExtraService = prevPage.data.order.orderExtraServices[options.id];
		let edit = options.edit
		console.log("edit")
		console.log(edit)
		this.setData({
			edit: edit == 1 ? true : false
		})
		let orderExtraServiceId = orderExtraService.id
		this.setData({
			orderExtraServiceId: orderExtraServiceId
		})

		let url = COM.load('CON').GET_ORDER_EXTRA_SERVICE_BY_ID + orderExtraServiceId;
		COM.load('NetUtil').netUtil(url, "GET", "", (callback) => {
			let orderExtraService = callback;
			let message = callback.message
			if(message == "" && edit == 0)
			{
				message = "暂无留言"
			}
			this.setData({
				message: message
			})


			if (orderExtraService.images != null) {
				let images = JSON.parse(orderExtraService.images)
				this.setData(
					{
						imagesIndex: images
					}
				)
				let chooseImages = []
				for (var i = 0; i < images.length; i++) {
					console.log(images[i])
					chooseImages.push(COM.load('CON').IMG_ORDER_EXTRASERVICE + orderExtraServiceId + "/" + images[i] + ".png")
				}
				console.log(chooseImages)
				this.setData({
					chooseImage: chooseImages
				})
			} else if (orderExtraService.video != null) {
				this.setData({
					chooseVideo: COM.load('CON').IMG_ORDER_EXTRASERVICE + orderExtraServiceId + "/" + +orderExtraService.video + ".mp4"
				})
			}



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
		
    let self = this
        var thisIndex = e.currentTarget.dataset.index;
        var allImage = this.data.chooseImage;
       
		
		
    var images = this.data.imagesIndex
		console.log(images.length)
		console.log(thisIndex)
		//删除的图像是已上传的
		if(images.length-1 >= thisIndex)
		{
			wx.showModal({
				title: '提示',
				content: '确定删除嘛?删除后不能恢复哦',
				confirmText: "删除图像",
				success: function(e){
					let imageName = images[thisIndex]
					let url = COM.load('CON').DELETE_FILE;
					let cData = 
						{
							"id": self.data.orderExtraServiceId,
							"table": "orderExtraService",
							"name": imageName,
							"type": "images"
						
						}
					

					
					COM.load('NetUtil').netUtil(url, "PUT", cData, (callback) => {
						if (callback == true) {
							images.splice(thisIndex, 1);
							allImage.splice(thisIndex, 1);
							self.setData({
								imagesIndex:images,
								chooseImage: allImage
							})
						} else {
							wx.showModal({
								title: '提示',
								content: '更新失败,请再次尝试',
								showCancel: false,

							})
						}

					})

				}
			})

		}else{
			allImage.splice(thisIndex, 1);
			self.setData({				
				chooseImage: allImage
			})
		}
      
    },
    /**
     * 删除视频
     */
    bindDeleteVideo: function(e) 
	{
		let self = this
		

		wx.showModal({
			title: '提示',
			content: '确定删除嘛?删除后不能恢复哦',
			confirmText: "删除视频",
			success: function (e) {
				let fileName = self.data.chooseVideo
				let url = COM.load('CON').DELETE_FILE;
				let cData =
					{
						"id": self.data.orderExtraServiceId,
						"table": "orderExtraService",
						"name": fileName,
						"type": "video"

					}



				COM.load('NetUtil').netUtil(url, "PUT", cData, (callback) => {
					if (callback == true) {
						self.setData({
							chooseVideo: ''
						})
					} else {
						wx.showModal({
							title: '提示',
							content: '更新失败,请重新尝试',
							showCancel: false,

						})
					}

				})

			}
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
        //videoContext.requestFullScreen();
    },
	videoErrorCallback: function (e) {
		console.log('视频错误信息:')
		console.log(e.detail.errMsg)
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
		if(self.data.edit == true)
		{
			console.log(this.data)
			console.log(e)
			let message = e.detail.value.textarea;
			if (message != '') {
				let url = COM.load('CON').ORDER_EXTRA_SERVICE_MESSAGE;
				COM.load('NetUtil').netUtil(url, "POST", {
					"message": message,
					"orderExtraServiceId": self.data.orderExtraServiceId
				}, (callback) => {
					if (callback == true) {
						self.upload()

					} else {
						wx.showModal({
							title: '提示',
							content: '更新失败,请重新尝试',
							showCancel: false,

						})
					}

				},false)
			} else {
				self.upload()
			}

		}else{
			wx.navigateBack({
				delta:1
			})
		}
        


    },
    upload: function() {
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
                        success: function(res) {
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
                        success: function(res) {
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
                        success: function(res) {
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
                        success: function(res) {
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


        } else {
            wx.navigateBack({
                delta: 1
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