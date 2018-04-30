var CON = require('constant.js');
/**
 * 网络请求的统一封装
 * params url地址 body网络请求中的body callback成功回调
 * 返回 格式res:{code:1/-1, errMsg, data} 1成功 -1失败
 * 包含统一的加载中 加载失败提示
 * **/
function netUtil(url, method,body, callBack, hide = true) {
  wx.showLoading({
    title: '加载中，请稍等',
    mask: true,

  }) 
  var callBackData = {};

  //微信请求 
  wx.request({
    url: url,
    header: CON.HEADERS,
    method: method,
    data: body,
    success: function (res) {
      if (200 <= res.statusCode && res.statusCode <= 299) {
        callBackData.data = res.data;
        callBack(callBackData.data);
        
      } else if (res.statusCode === 404 || res.statusCode === 400){
        wx.showToast({
          title: "无法找到数据",
          duration: 1500,
          mask: true
        })
      } else if (500 <= res.statusCode && res.statusCode <= 599) {
        wx.showToast({
          title: "系统故障,请稍后再试",
          duration: 1500,
          mask: true
        })
        
      }
     
    },
    fail: function (res) {
			console.log(res)
      if (res.errMsg.includes("timeout")) {
        wx.showToast({
          title: "服务器忙,请稍后再试",
          duration: 3000,
          mask: true
        })
      } else {
				console.log(res)
      wx.showToast({
        title: "please check ",
        duration: 3000,
        mask: true
      })}
       
    },
		complete: function(res){
			console.log("加载结束")
			if(hide)
			{
				wx.hideLoading()
			}
			
		}
  });
}

function uploadFile(url, method, list, callBack, hide = true) {
	var self = this
	console.log("上传开始")
	
	var callBackData = {};
	wx.showLoading({
		title: '正在上传',
		mask: true
	})
	//微信请求 上传图片
	uploadAllFiles(url, list, callBack, hide );
	
	
}
function uploadAllFiles(url,list,callBack, hide)
{
	console.log(list)
	if (typeof list !== 'undefined' && list.length > 0)
	{
		wx.uploadFile({
			url: url,
			filePath: list[0].file,
			name: "file",
			formData: {
				'table': list[0].table,
				'id': list[0].id,
				'name': list[0].name
			},
			success: function (res) {
				if (200 <= res.statusCode && res.statusCode <= 299) {
					console.log("upload img success")
				} else if (res.statusCode === 404 || res.statusCode === 400) {
					wx.showToast({
						title: "无法找到数据",
						duration: 1500,
						mask: true
					})
				} else if (500 <= res.statusCode && res.statusCode <= 599) {
					wx.showToast({
						title: "系统故障,请稍后再试",
						duration: 1500,
						mask: true
					})

				}

			},
			fail: function (res) {
				console.log(res)
				if (res.errMsg.includes("timeout")) {
					wx.showToast({
						title: "服务器忙,请稍后再试",
						duration: 3000,
						mask: true
					})
				} else {
					console.log(res)
					wx.showToast({
						title: "please check ",
						duration: 3000,
						mask: true
					})
				}

			},
			complete: function (res) {
				console.log("complete +1")
				list.shift();
				uploadAllFiles(url, list, callBack)				
			}
		})
	}else{
		callBack("done");
		if (hide) {
			wx.hideLoading()
		}
		return;
	}
	
	
}


module.exports = {
  netUtil: netUtil,
	uploadFile: uploadFile,
}



