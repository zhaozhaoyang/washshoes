const app = getApp()
// pages/coupons/coupons.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    list1: '',
    list2: ''
  },
  goIndex() {
    wx.switchTab({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var base = app.globalData.base
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    app.getAuthKey().then(function(res) {
      var uid = res.data
      // console.log(url)
      wx.request({
        url: `${base}?json={"cmd":"mycouponlist","uid":"${uid}","type":"0"}`,
        success: function(res) {
          // console.log(res.data.dataList)
          var data = res.data.dataList
          // console.log(data)
          if (data) {
            for (let i = 0; i < data.length; i++) {
              data[i].price = parseInt(data[i].price)
              data[i].fullprice = parseInt(data[i].fullprice)
            }
          }
          // data.price=parseInt(data.price)
          if (res.data.dataList) {
            that.setData({
              list: data
            })
          } else {
            that.setData({
              list: ''
            })
          }

          wx.hideLoading()

        }
      })
      wx.request({
        url: `${base}?json={"cmd":"mycouponlist","uid":"${uid}","type":"1"}`,
        success: function(res) {
          // console.log(res.data.dataList)
          var data = res.data.dataList
          if (data) {
            for (let i = 0; i < data.length; i++) {
              data[i].price = parseInt(data[i].price)
              data[i].fullprice = parseInt(data[i].fullprice)
            }
          }
          if (res.data.dataList) {
            that.setData({
              list1: data
            })
          } else {
            that.setData({
              list1: ''
            })
          }
        }
      })
      wx.request({
        url: `${base}?json={"cmd":"mycouponlist","uid":"${uid}","type":"2"}`,
        success: function(res) {
          // console.log(res.data.dataList)
          var data = res.data.dataList
          if (data) {
            for (let i = 0; i < data.length; i++) {
              data[i].price = parseInt(data[i].price)
              data[i].fullprice = parseInt(data[i].fullprice)
            }
          }
          if (res.data.dataList) {
            that.setData({
              list2: res.data.dataList
            })
          } else {
            that.setData({
              list2: ''
            })
          }
        }
      })
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