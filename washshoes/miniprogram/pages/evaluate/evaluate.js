// pages/evaluate/evaluate.js
const app = getApp()
import Dialog from '../../dist/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageURL: '../../images/tu2x.png',
    show: false,
    list: ''
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onDel(e) {
    var that = this
    var base = app.globalData.base
    // console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    this.setData({
      show: true
    })
    Dialog.confirm({

      message: '确认删除？'
    }).then(() => {
      // on confirm
      this.setData({
        show: false
      })
      app.getAuthKey().then(function(res) {
        var uid = res.data
        wx.request({
          url: `${base}?json={"cmd":"deletegoodscomments","commentid":"${id}","uid":"${uid}"}`,
          success: function(res) {
            var data = res.data
            console.log(data)
            // that.setData({
            //   list:data
            // })
            that.onLoad()
          }
        })

      })

    }).catch(() => {
      // on cancel
      this.setData({
        show: false
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var base = app.globalData.base
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"mygoodscomments","uid":"${uid}","nowPage":"1","pageCount":"10"}`,

        success: function(res) {
          var data = res.data.dataList
          console.log(data)
          that.setData({
            list: data
          })
          wx.hideLoading()
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