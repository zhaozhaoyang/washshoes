var app = getApp();
// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    list1: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var base = app.globalData.base
    var that = this
    wx.showLoading({
      title: '加载中…',
    })
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"myExtension","uid":"${uid}"}`,
        success: function(res) {
          var data = res.data.dataList
          // console.log(data)
          if (data) {
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
        url: `${base}?json={"cmd":"myExtensionincome","uid":"${uid}"}`,
        success: function(res) {
          var data = res.data.dataList
          // console.log(data)
          if (data) {
            that.setData({
              list1: data
            })
          } else {
            that.setData({
              list1: ''
            })
          }
          wx.hideLoading()

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