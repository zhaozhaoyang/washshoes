// pages/integral/integral.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [

    ],
    integral: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中…',
    })
    var that = this
    var base = app.globalData.base
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"integercenter","uid":"${uid}"}`,
        success: function(res) {
          var data = res.data.dataList
          // console.log(res)
          that.setData({
            list: data,
            integral: res.data.integral
          })
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