Page({
  data: {
    inputContent:'',
    placeHolder:'',
  },

  submitTextarea: function (event) {
    var self = this;
    let input = event.detail.value.textarea.trim();
    if ( input=== "")
	{
		wx.navigateBack({
			delta: 1,
		})
		return;
	}
	 
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      memo: input
    })
	wx.navigateBack({
		delta:1
	})
  },

  onLoad:function(option) {
	console.log(option)
    this.setData({ inputContent: option.content, placeHolder: option.placeHolder});
  }

})