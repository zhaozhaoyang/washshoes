const app = getApp()
// pages/coupons/coupons.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    list1: ''
  },
  goIndex(e) {
    // console.log(e.currentTarget.dataset.index)
    var i = e.currentTarget.dataset.index
    var list = this.data.list
    wx.navigateBack({
      delta: 1
    })
    var json = {
      mycouponid: list[i].mycouponid,
      price: list[i].price,
      type: list[i].type
    }
    json = JSON.stringify(json)
    wx.setStorageSync("coupon", json)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var price = options.price
    console.log(price)
    var base = app.globalData.base
    var that = this
    var check = options.checked
    wx.showLoading({
      title: '加载中',
    })
    app.getAuthKey().then(function(res) {
      console.log(typeof check)
      var uid = res.data
      if (check == 'true') {
        console.log('000')
        wx.request({
          url: `${base}?json={"cmd":"myExtensionincome","uid":"${uid}"}`,
          success: function(res) {
            var data = res.data.dataList
            console.log(res)
            if (data) {
              for (var i = 0; i < data.length; i++) {
                if (price < data[i].fullprice) {
                  data.splice(i, 1)
                }
              }
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
      } else if (check == 'false') { //普通状态 普通和推广都能用
        console.log('111')
        var arr = []
        var brr = []
        wx.request({
          url: `${base}?json={"cmd":"mycouponlist","uid":"${uid}","type":"0"}`,
          success: function(re) {
            console.log(re)
            var datas = re.data.dataList
            // console.log(data)
            for (var i = 0; i < datas.length; i++) {
              if (price >= datas[i].fullprice) {
                // datas.splice(i, 1)
                brr.push(datas[i])
              }
            }
            console.log(brr)
            for (let i = 0; i < datas.length; i++) {
              datas[i].price = parseInt(datas[i].price)
              datas[i].fullprice = parseInt(datas[i].fullprice)
            }
            // console.log(arr)
            wx.request({
              url: `${base}?json={"cmd":"myExtensionincome","uid":"${uid}"}`,
              success: function(res) {
                var data = res.data.dataList
                for (let i = 0; i < datas.length; i++) {
                  datas[i].price = parseInt(datas[i].price)
                  datas[i].fullprice = parseInt(datas[i].fullprice)
                  arr.push(datas[i])
                }
                // console.log(res)
                if (data) {
                  for (var i = 0; i < data.length; i++) {
                    if (price < data[i].fullprice) {
                      data.splice(i, 1)
                    }
                  }
                  for (let i = 0; i < data.length; i++) {
                    data[i].price = parseInt(data[i].price)
                    data[i].fullprice = parseInt(data[i].fullprice)
                    arr.push(data[i])
                  }
                  that.setData({
                    list: arr
                  })
                }
                that.setData({
                  list: arr
                })
                console.log(that.data.list)

                wx.hideLoading()
              }
            })
            // data.price=parseInt(data.price)
            // if (res.data.dataList) {
            //   that.setData({
            //     list: data
            //   })
            // } else {
            //   that.setData({
            //     list: ''
            //   })
            // }

            wx.hideLoading()

          }
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