const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')

var uid = app.globalData.uid
// pages/vip/vip.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
    list: [],
    uid: '',
    usertype: '',
    nodes: '',
    balance: 0,
    bg: ''
  },
  goOpn(e) {
    var self = this;
    wx.navigateTo({
      url: '../open/open?balance=' + self.data.balance
    });
  },
  formid: app.formid,
  goInteg() {
    wx.navigateTo({
      url: '../integral/integral'

    });
  },
  clickFormView(event) { //模板消息的模板
    let formid = event.detail.formId;
    // console.log(formid)
    if (formid && formid !== 'the formId is a mock one') {
      app.formid(formid)
    }
    // app.formid(formid)
    // 忽略开发者工具里边的formId
    // if (formId && formId !== 'the formId is a mock one') {
    //     wx.request({
    //         method: 'POST',
    //         url: '/api/collectFormId', // 该接口只用来收集formId
    //         data: { formId: formId } // 只传了一个formId，因为openid和当前用户通常会事先在后台做一个关联，看具体业务了
    //     });
    // }
    // 然后可以干其他事了，比如跳转页面，其他业务逻辑 
    // TODO
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
    app.getAuthKey().then(function(res) {
      var uid = res.data
      // var url = `${base}?json={"cmd":"membercenter","uid":"${uid}"}`
      // console.log(url)
      wx.request({
        url: `${base}?json={"cmd":"membercenter","uid":"${uid}"}`,
        success: function(res) {
          var data = res.data.dataobject
          var list = res.data.dataList
          var usertype = app.globalData.userinfo.usertype
          // console.log(app.globalData.userinfo.usertype)
          if (usertype == 0) {
            usertype = '铁刷会员'
          } else if (usertype == 1) {
            usertype = '铜刷会员'
          } else if (usertype == 2) {
            usertype = '钢刷会员'
          } else if (usertype == 3) {
            usertype = '银刷会员'
          } else if (usertype == 4) {
            usertype = '金刷会员'
          }
          that.setData({
            obj: data,
            list: list,
            usertype: usertype,
            nodes: data.content,
            balance: data.balance,
            bg: data.usertypeimage
          })
          console.log(that.data.obj)
          var temp = WxParse.wxParse('nodes', 'html', that.data.nodes, that);
          wx.setStorage({
            key: 'viplist',
            data: list,
          })
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