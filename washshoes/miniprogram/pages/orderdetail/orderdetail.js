// pages/orderdetail/orderdetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageURL: '../../images/tu2x.png',
    list: [

    ],
    list1: [
      "订单号：2535422655",
      "创建时间：2019-03-04   15:20:14",
      "付款时间：2019-03-04   15:20:14",
      "完成时间：2019-03-04   15:20:15",
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中…',
      mask: true,

    });

    var base = app.globalData.base
    //console.log(options) //传参，订单号
    var id = options.id
    var that = this
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"myorderDetail","uid":"${uid}","ordernum":"${id}"}`,
        success: function(res) {
          var data = res.data.dataobject
          //console.log(data)
          if (data.paytype == 0) {
            data.paytype = "余额支付"
          } else if (data.paytype == 1) {
            data.paytype = "微信支付"
          }
          if (data.type == 0) {
            data.type = "线上邮寄"
          } else if (data.type == 1) {
            data.type = "自行送取"
          }
          // data.orderdetail[0].goodsimage=data.orderdetail[0].goodsimage.substring(26)
          // for (var i = 0; i < data.orderdetail.length; i++) {
          //   data.orderdetail[i].goodsimage = data.orderdetail[i].goodsimage.substring(26)
          // }
          // data
          that.setData({
            list: data
          })
          wx.hideLoading()
        }
      })

    })

  },
  copyTBL: function(e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.list.shopname + self.data.list.shopphone + self.data.list.shopaddress,
      success: function(res) {
        // self.setData({copyTip:true}),
        wx.showToast({
          title: '复制成功',
          // content: '复制成功',
          // success: function (res) {
          //   if (res.confirm) {
          //     //console.log('确定')
          //   } else if (res.cancel) {
          //     //console.log('取消')
          //   }
          // }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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