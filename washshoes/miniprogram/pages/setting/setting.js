// pages/setting/setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      "帮助中心",
      "意见反馈",
      "关于我们"
    ]
  },
  goHel(event) {
    // console.log(event.target.id)
    let id = event.target.id
    if (id == 0) {
      wx.navigateTo({
        url: '../help/help',
      })
    }
    if (id == 1) {
      wx.navigateTo({
        url: '../feedback/feedback',
      })
    }
    if (id == 2) {
      wx.navigateTo({
        url: '../about/about',
      })
    }

  },

  goCall() {
    var base = app.globalData.base
    var that = this
    wx.request({
      url: `${base}?json={"cmd":"customercenter"}`,
      success(res) {
        //console.log(res.data.phone)
        that.setData({
          phone: res.data.phone
        })
        wx.makePhoneCall({
          phoneNumber: that.data.phone //仅为示例，并非真实的电话号码
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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