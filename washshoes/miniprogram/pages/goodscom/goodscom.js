// pages/goodscom/goodscom.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    cate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    wx.showLoading({
      title: '加载中…',
    })
    var id = options.id
    var cate = options.cate
    this.setData({
      cate: cate
    })
    var that = this
    var base = app.globalData.base
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({

        url: `${base}?json={"cmd":"goodscomments","goodsid":"${id}","uid":"${uid}"}`,

        success: res => {
          // console.log(res)
          // console.log()
          wx.hideLoading()
          var list = res.data.dataList
          if (list) {
            that.setData({
              list: list
            })
          } else {
            that.setData({
              list: ''
            })
          }

        }
      })

    })

  },
  preview(e) {
    var i = e.currentTarget.dataset.index
    var j = e.currentTarget.dataset.j
    wx.previewImage({
      current: this.data.list[j].images[i], // 当前显示图片的http链接
      urls: this.data.list[j].images // 需要预览的图片http链接列表
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