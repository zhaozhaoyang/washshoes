// pages/choose/choose.js
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adr: [],
    provincename: '',
    array: [],
    index: 0
  },
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    // Toast(`当前值：${value}, 当前索引：${index}`);
  },
  select(e) {
    // //console.log(e.currentTarget.dataset.info)
    var id = e.currentTarget.dataset.id
    var info = e.currentTarget.dataset.info
    // wx.navigateTo({
    //   url: '../orderinfo/orderinfo?id='+id,
    // })
    wx.setStorage({
      key: 'shop',
      data: info,
    })
    wx.navigateBack({
      delta: 1
    })
  },
  selPro() {
    this.setData({
      show: true
    })
  },
  bindPickerChange: function(e) {
    // //console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value
    this.setData({
      index: index
    })
    var province = this.data.array[index]
    //console.log(province)
    this.getShop(province)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    qqmapsdk = new QQMapWX({
      key: '4ASBZ-YLP64-LYPUM-X36EU-LQEXT-TIF47'
    });
    this.getShop()
  },
  getShop(province) {
    var that = this
    var base = app.globalData.base
    var province = province ? province : ""
    //console.log(province)
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"getshoplist","uid":"${uid}","province":"${province}"}`,
        success: function(res) {
          // //console.log(res.data.dataList)
          if (res.data.dataList) {
            for (var i = 0; i < that.data.array.length; i++) {
              if (that.data.array[i] == res.data.dataList[0].provincename) {
                that.setData({
                  index: i
                })
              }
            }
            that.setData({
              adr: res.data.dataList
            })
            var adr = res.data.dataList
            for (let i = 0; i < adr.length; i++) {
              if (adr[i].iszong == 1) {
                wx.setStorage({
                  key: 'shop',
                  data: adr[i],
                })
              }
            }
          } else {
            that.setData({
              adr: ""
            })
          }
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
    var _this = this;
    //调用获取城市列表接口
    qqmapsdk.getCityList({
      success: function(res) { //成功后的回调
        // //console.log(res);
        // //console.log('省份数据：', res.result[0]); //打印省份数据
        var arr = []
        for (var i = 0; i < res.result[0].length; i++) {
          arr.push(res.result[0][i]['fullname'])
        }
        _this.setData({
          array: arr
        })
        // //console.log('城市数据：', res.result[1]); //打印城市数据
        // //console.log('区县数据：', res.result[2]); //打印区县数据
      },
      fail: function(error) {
        //console.error(error);
      },
      complete: function(res) {
        // //console.log(res);
      }
    });
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