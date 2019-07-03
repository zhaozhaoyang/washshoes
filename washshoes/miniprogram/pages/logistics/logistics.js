// pages/logistics/logistics.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordernum: '',
    steps: [],
    company: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(app.globalData.uid)
    // console.log(options)
    var that = this

    var logistics = options.logistics
    var logisticsnum = options.logisticsnum
    that.setData({
      ordernum: options.ordernum,
      company: options.logisticsnum
    })
    var uid = app.globalData.uid;
    var base = app.globalData.base
    var data = `{"cmd":"lookwuliu","logistics":"${logistics}","logisticsnum":"${logisticsnum}"}` //
    // data=JSON.stringify(data)
    wx.request({
      url: `${base}?json=${data}`,
      // data: data,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.dataList)
        var step = res.data.dataList
        var steps = []
        for (var i = 0; i < step.length; i++) {
          var obj = {}
          obj.text = step[i].remark
          obj.desc = step[i].datetime
          steps.push(obj)
        }
        that.setData({
          steps: steps
        })
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