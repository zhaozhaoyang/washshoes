// pages/help/help.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ''
  },
  goHpDet(e) {
    // console.log(e)
    var id = e.currentTarget.dataset.id
    // var obj=e.currentTarget.dataset.obj
    // var title=obj.title
    // var content=obj.content
    wx.setStorageSync('hdetail', this.data.list)
    wx.navigateTo({
      url: `../hdetail/hdetail?id=${id}`,
    })
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
    wx.request({
      url: `${base}?json={"cmd":"helpList"}`,
      success(res) {
        console.log(res.data)
        that.setData({
          list: res.data.dataList
        })
        wx.hideLoading()
      }
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