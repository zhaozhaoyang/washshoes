// pages/feedback/feedback.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ''
  },
  bindFormSubmit(e) {
    // console.log(e)
    wx.showLoading({
      title: '提交中…',
    })
    var formid = e.detail.formId
    var base = app.globalData.base
    var that = this
    //console.log(e.detail.value.textarea)
    that.setData({
      content: e.detail.value.textarea
    })
    var content = e.detail.value.textarea
    if (!content) {
      wx.showToast({
        title: '提交内容不能为空',
      })
    } else {
      app.getAuthKey().then(function(res) {
        var uid = res.data
        wx.request({
          url: `${base}?json={"cmd":"feedback","uid":"${uid}","content":"${content}"}`,
          success(res) {
            //console.log(res.data)
            app.formid(formid)
            wx.hideLoading()
            wx.showToast({
              title: '提交成功',
              duration: 2000
            })
          }
        })
        wx.navigateBack({
          delta: 1,
        })

      })

    }

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