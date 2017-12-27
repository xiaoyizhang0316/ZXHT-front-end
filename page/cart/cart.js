// page/component/new-pages/cart/cart.js
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true,    // 全选状态，默认全选
    obj:{
        name:"hello"
    },

  },

  onShow() {
    var self = this
    wx.getStorage({
      key: 'cartList',
      success: function (res) {
        if (res.data.length > 0) {

          self.setData({
            hasList: true,
            carts: res.data
          });

        } else {
          self.setData({
            carts: [],
            hasCarts: false,
          })
        }
        self.getTotalPrice();
      },
    })
    
  },

  clearAll(e) {

    var self = this
    wx.showModal({
      title: '提示',
      content: '确认要清空购物车吗?',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          self.setData({
            hasList: false,
            carts: []
          });

          wx.setStorage({
            key: "cartList",
            data: self.data.carts
          })
        } else {
          // console.log('用户点击取消')
        }
      }
    })

  },

  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const self = this
    const index = e.currentTarget.dataset.index;
    var title = e.currentTarget.dataset.title;
    let carts = self.data.carts;

    wx.showModal({
      title: '确认删除吗?',
      content: '商品名:' + title,
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          carts.splice(index, 1);
          self.setData({
            carts: carts
          });

          wx.setStorage({
            key: "cartList",
            data: self.data.carts
          })

          if (!carts.length) {
            self.setData({
              hasList: false
            });
          } else {
            self.getTotalPrice();
          }

        } else {
          // console.log('用户点击取消')
        }
      }
    })

  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });

    wx.setStorage({
      key: "cartList",
      data: this.data.carts
    })

    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let num = carts[index].num;
    if(num <= 1){
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });

    wx.setStorage({
      key: "cartList",
      data: this.data.carts
    })
    
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

 /**
 * 进入订单确认页
 */
  orderConfirm(e) {

    // 提交前可能要做一些检查
    // checkStock()
    // updatePrice()


    let carts = this.data.carts;
    let total = 0

    var orderDate = []
    for (let i = 0; i < carts.length; i++) {         
      if (carts[i].selected) {                     
        orderDate.push(carts[i]);
      }
    }

    if (orderDate.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '您还没有添加商品',
      })
      return false
    }

    var orderInfo = {
      // 'totalPrice': this.data.totalPrice,
      'data': orderDate
    }

    this.setData({    
      orderInfo: orderInfo,
    });

    wx.setStorage({
      key: "orderInfo",
      data: orderInfo,
      fail(){
        wx.showModal({
          title: '提示',
          content: '错误',
        })
        return;
      }
    })

    wx.navigateTo({
      url: '/page/cart/orders/orders',
    })

  },

  /**
  * 检查库存 todo
  */
  checkStock(){

  },

  /**
  * 更新商品单价 todo
  */
  updatePrice() {

  }

})