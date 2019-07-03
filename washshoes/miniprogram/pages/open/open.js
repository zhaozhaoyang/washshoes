// pages/open/open.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    usertype: '',
    num: 0,
    balance: 0
  },
  menuClick: function(e) {
    // //console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id
    // //console.log(id)
    // this.data.list[i].num=e.target.dataset.num
    that.setData({
      num: e.currentTarget.dataset.id
    })
  },
  pay() {
    var that = this
    app.getAuthKey().then(function(res) {
      var i = that.data.num
      // //console.log(i)
      var price = that.data.list[i].usertypeprice

      var uid = res.data
      var base = app.globalData.base
      var usertypeid = that.data.list[i].usertypeid
      // //console.log(price,usertypeid)
      wx.request({
        url: `${base}?json={"cmd":"rechargemember","uid":"${uid}","usertypeid":"${usertypeid}","price":"${price}"}`,

        success: function(res) {
          var data = res.data.dataList
          // //console.log(res)
          // that.setData({
          //   list: data
          // })
          var ordernum = res.data.ordernum

          app.getAuthKey().then(function(res) {
            var uid = res.data
            var base = app.globalData.Url
            // //console.log(url)

            var data = `uid=${uid}&ordernum=${ordernum}&price=${price}`

            wx.request({
              url: `${base}/payment?${data}`,
              // data: data,
              method: "POST",
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                // //console.log(res)
                var body = res.data.body
                // // that.setData({
                //   body: body
                // })
                wx.requestPayment({
                  timeStamp: body.timeStamp,
                  nonceStr: body.nonceStr,
                  package: body.package,
                  signType: 'MD5',
                  paySign: body.paySign,
                  success(res) {
                    // //console.log(res)
                    wx.redirectTo({
                      url: '../paysuc/paysuc',
                    })
                  },
                  fail(res) {}
                })
              }

            })


          })
          wx.hideLoading()
          // wx.navigateTo({
          //   url: `../scode/scode?total=${price}&ordernum=${res.data.ordernum}&type=3`,
          // })
        }
      })

    })

  },
  clickFormView(event) { //模板消息的模板
    let formid = event.detail.formId;
    if (formid && formid !== 'the formId is a mock one') {
      app.formid(formid)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中…',
    })
    console.log(options);
    // //console.log(wx.getStorageSync("viplist"))
    var that = this
    wx.getStorage({
      key: 'viplist',
      success(res) {
        //console.log(res.data)
        var list = res.data;
        for (var i = 0; i < list.length; i++) {
          if (list[i].usertype == 1) {
            list[i].usertype = '铜刷会员'
          }
          if (list[i].usertype == 2) {
            list[i].usertype = '钢刷会员'
          }
          if (list[i].usertype == 3) {
            list[i].usertype = '银刷会员'
          }
          if (list[i].usertype == 4) {
            list[i].usertype = '金刷会员'
          }
        }
        that.setData({
          list: list,
          balance: options.balance
        })
        wx.hideLoading()
      }
    })
    // var list = wx.getStorageSync("viplist")



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