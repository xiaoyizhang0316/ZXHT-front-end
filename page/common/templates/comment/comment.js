// page/common/templates/editOrderExtraSerivce/editOrderExtraService.js
var COM = require('../../../../utils/common.js');
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

        chooseImage: [],
        imagesIndex: [],
        message: '',
        commentId: '',
        buttonFlag: true,
        edit: false,
        params: [],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        let self = this
        let params = options.params;
        params = JSON.parse(params);
        self.setData({
            params: params
        })
        console.log(params);


        let url = COM.load('CON').GET_COMMENT + "orderId/" + params.orderId + "/productId/" + params.productId;
        COM.load('NetUtil').netUtil(url, "GET", "", (callback) => {

            let message = callback

            if (callback == "" || callback == null) {
                console.log(callback)
                self.setData({
                    message: "",
                })
            } else {
                self.setData({
                    message: callback.message,
					commentId : callback.id,
                    imagesIndex: JSON.parse(callback.images)
                })
				let chooseImages = []
				for (var i = 0; i < self.data.imagesIndex.length; i++) {
					
					chooseImages.push(COM.load('CON').IMG_COMMENT + self.data.commentId + "/" + self.data.imagesIndex[i] + ".png")
				}
				
				this.setData({
					chooseImage: chooseImages
				})
            }
        })



    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function(res) {

    },

    /**
     * 选择上传文件
     */
    bindChooseMedia: function(e) {
        let this_ = this

        // 图片
        console.log('图片')

        var haveImage = this_.data.chooseImage;
        wx.chooseImage({
            count: 3 - haveImage.length, // 默认3
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                console.log(tempFilePaths)
                this_.setData({
                    chooseImage: haveImage.concat(tempFilePaths),
                })
            }
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
        if (images.length - 1 >= thisIndex) {
            wx.showModal({
                title: '提示',
                content: '确定删除嘛?删除后不能恢复哦',
                confirmText: "删除图像",
                success: function(e) {
                    let imageName = images[thisIndex]
                    let url = COM.load('CON').DELETE_FILE;

                    let cData = {
                        "id": self.data.commentId,
                        "table": "comment",
                        "name": imageName,
                        "type": "images"

                    }



                    COM.load('NetUtil').netUtil(url, "PUT", cData, (callback) => {
                        if (callback == true) {
                            images.splice(thisIndex, 1);
                            allImage.splice(thisIndex, 1);
                            self.setData({
                                imagesIndex: images,
                                chooseImage: allImage
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

        } else {
            allImage.splice(thisIndex, 1);
            self.setData({
                chooseImage: allImage
            })
        }

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

    submitForm: function(e) {

        this.setData({
            buttonFlag: false
        })
        let self = this

        let message = e.detail.value.textarea;
		let params = self.data.params
		params.message = message;
		console.log(params)
        
        if (message != '' || self.data.chooseImage.length > 0) {
            let url = COM.load('CON').ADD_COMMENT;
            COM.load('NetUtil').netUtil(url, "POST", params, (callback) => {
                if (callback) {
					self.setData({
						commentId : callback,
					})
                    self.upload()

                } else {
                    wx.showModal({
                        title: '提示',
                        content: '上传失败,请检查网络后重新尝试',
                        showCancel: false,

                    })
                }

            }, false)
        } else {
            wx.showModal({
                title: '提示',
                content: '图像和文字评论请至少填写一个',
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
                    "id": self.data.commentId,
                    "table": "comment",
                    "name": "images",
                    "file": self.data.chooseImage[i]
                })

            }

            //上传图片
            console.log("img data here")
            console.log(cData)
            let url = COM.load("CON").UPLOADFILE;
            COM.load('NetUtil').uploadFile(url, "POST", cData, (callback) => {
               
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