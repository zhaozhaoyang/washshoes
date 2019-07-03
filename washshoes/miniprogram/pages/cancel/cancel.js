// pages/cancel/cancel.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '',
    id: '',
    list: [
      "拍错了",
      "订单信息有误",
      "不想要了",
      "个人原因",
      "重新购买"
    ]
  },
  onChange(event) {
    // console.log(event)
    this.setData({
      radio: event.detail
    });
    // console.log(this.data.radio)
  },
  onClick(event) {
    // console.log(event)
  },
  sure() {

    var base = app.globalData.base;
    var radio = this.data.radio;
    var id = this.data.id;
    var that = this
    // console.log(radio,id)
    if (this.data.radio == '') {
      wx.showToast({
        title: '请选择原因',
        icon: 'none'
      })
      return
    }
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"cancelorder","uid":"${uid}","ordernum":"${id}","reason":"${radio}"}`,
        success: function(res) {
          var data = res.data
          console.log(data)
          // that.setData({
          //   list1:data
          // })
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '../order/order?id=' + 1,
          })
        }
      })

    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    var id = options.id;
    this.setData({
      id: id
    })

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
    // wx.navigateTo({
    //   url: '../person',
    // })
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