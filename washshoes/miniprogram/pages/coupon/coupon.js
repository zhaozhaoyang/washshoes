// pages/coupon/coupon.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ''
  },
  getCou(e) { //领取
    var base = app.globalData.base
    var that = this
    //console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var list = that.data.list

    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({

        url: `${base}?json={"cmd":"receivecoupon","uid":"${uid}","couponid":"${id}"}`,

        success: res => {
          //console.log(res)
          wx.showToast({
            title: '领取成功',
            success() {
              if (list) {
                list.splice(index, 1)
                that.setData({
                  list: list
                })
              }
            }
          })
        }
      })

    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var base = app.globalData.base
    wx.showLoading({
      title: '加载中…',
    })
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({

        url: `${base}?json={"cmd":"getnotreceivecoupon","uid":"${uid}"}`,

        success: res => {
          //console.log(res)
          // var data = res.data.dataList
          // //console.log(res.data)
          var data = res.data.dataList
          // //console.log(data)
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