// var json = require('../../data/Home_data.js')
const app = getApp()
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    cartItems: [],
    total: 0,
    CheckAll: false,
    value: 1,
    disabled: true,
    show: false,
    delArr: []
  },
  onLoad: function(e) {
    // //console.log('加载了吗')
    // //console.log()
    // var uid = wx.getStorageSync('uid')
    var uid = app.globalData.uid
    var that = this
    that.setData({
      CheckAll: false,
      total: 0,
      value: 1
    })
    wx.showLoading({
      title: '加载中…',
    })
    // app.getAuthKey().then(function (res) {
    // var uid = res.data
    // //console.log(uid)
    wx.request({
      url: `https://xcx.brush666.com/washshoes/api/service?json={"cmd":"mygoodscar","uid":"${uid}"}`,
      success: function(res) {
        // console.log(res.data)
        var cartItems = res.data.dataList
        console.log(cartItems, '购物车')
        if (cartItems) {
          for (let i = 0; i < cartItems.length; i++) {
            cartItems[i].value = 1
            cartItems[i].goodsprice = parseInt(cartItems[i].goodsprice)
            cartItems[i].checked = false
          }
        }
        if (cartItems) {
          that.setData({
            cartItems: cartItems
          })
        } else {
          that.setData({
            cartItems: ''
          })
        }
        wx.hideLoading()
      }


    })
    // })
  },
  onShow: function() {
    this.onLoad()
    this.getsumTotal()
    this.setData({
      CheckAll: false,
      total: 0
    })
    var cartItems = this.data.cartItems
    for (let i = 0; i < cartItems.length; i++) {
      cartItems[i].value = 1
    }
    this.setData({
      cartItems: cartItems
    })

  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onHide() {

  },

  //选择
  select: function(e) {
    this.data.delArr = []
    var CheckAll = this.data.CheckAll;
    CheckAll = !CheckAll
    var cartItems = this.data.cartItems
    for (var i = 0; i < cartItems.length; i++) {
      cartItems[i].selected = CheckAll
      cartItems[i].checked = CheckAll
    }
    this.setData({
      cartItems: cartItems,
      CheckAll: CheckAll
    })
    this.getsumTotal()
  },
  onChange(e) {
    var num = e.detail;
    var index = e.currentTarget.dataset.index
    this.data.cartItems[index].value = num
    this.getsumTotal()
  },

  // 选择
  selectedCart: function(e) {
    this.data.delArr = []
    var cartItems = this.data.cartItems //获取购物车列表
    var index = e.currentTarget.dataset.index; //获取当前点击事件的下标索引
    var selected = cartItems[index].selected; //获取购物车里面的value值
    this.data.cartItems[index].checked = !this.data.cartItems[index].checked;
    console.log(this.data.cartItems)
    //取反
    cartItems[index].selected = !selected;
    this.setData({
      cartItems: cartItems
    })
    this.getsumTotal();
  },




  //删除
  shanchu: function(e) {
    var that = this
    console.log(this.data.delArr)
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var base = app.globalData.base
    var cartItems = this.data.cartItems //获取购物车列表
    var list = that.data.cartItems
    for (var i = 0; i < list.length; i++) {
      if (list[i].checked) {
        that.data.delArr.push(list[i].goodscarid)
      }
    }
    if (that.data.delArr.length == 0) {
      wx.showToast({
        title: '请选择要删除的订单',
        icon: 'none'
      })
      return
    }
    that.setData({
      show: true
    })
    Dialog.confirm({
      message: '确认删除选中的订单吗？'
    }).then(() => {
      // on confirm
      this.setData({
        show: false
      })
      app.getAuthKey().then(function(res) {
        var uid = res.data
        wx.request({
          url: `${base}?json={"cmd":"deletegoodscar","goodscarid":${JSON.stringify(that.data.delArr)},"uid":"${uid}"}`,
          success: function(res) {
            var data = res.data
            wx.showToast({
              title: '删除成功',
            })
            that.onLoad()
          }
        })
      }).catch(() => {
        // on cancel
        this.setData({
          show: false
        });
      });
    }).catch(() => {
      this.setData({
        show: false
      })
    })
  },

  //提示
  go: function(e) {
    wx.navigateTo({
      url: '../orderinfo/orderinfo',
    })
  },


  //合计
  getsumTotal: function() {
    var sum = 0
    var that = this
    //  this.onChange(e)
    //  var price = 30
    var selectedArr = []
    for (var i = 0; i < this.data.cartItems.length; i++) {
      if (this.data.cartItems[i].selected) {

        sum += this.data.cartItems[i].value * this.data.cartItems[i].goodsprice
        selectedArr.push(this.data.cartItems[i])
      }
      if (sum != 0) {
        that.setData({
          disabled: false
        })
      } else {
        that.setData({
          disabled: true
        })
      }
    }
    //  //console.log(selectedArr)
    wx.setStorage({
      key: 'selectedArr',
      data: selectedArr,
    })
    //更新数据
    this.setData({
      total: sum
    })
  }

})