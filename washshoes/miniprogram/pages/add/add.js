// pages/add/add.js
const app = getApp()
// 添加地址
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isdefault: 0,
    // address: '',
    username: '',
    phonenum: '',
    address: '',
    adr: '',
    disabled:true,
    id:''
  },
  
  onChange(event) {
    //console.log(event)
    this.setData({
      isdefault: event.detail
    })
  },
  onConfirm(e) {
    // //console.log(e.currentTarget.dataset)
    var obj = e.currentTarget.dataset;
    var base = app.globalData.base
    var that = this
    var url = ''
    var id = that.data.id
    obj.isdefault = Number(obj.isdefault)
    // //console.log(obj.isdefault)
    app.getAuthKey().then(function (res) {
      var uid = res.data
      if (obj.username && obj.address && obj.phonenum) {
        that.setData({
          disabled:false
        })
        if(id){
          url=`${base}?json={"cmd":"addAddress","uid":"${uid}","name":"${obj.username}","phone":"${obj.phonenum}","address":"${obj.address}","addressdetail":"${obj.adr}","isdefault":"${obj.isdefault}","addressid":"${id}"}`
        }else{
          url=`${base}?json={"cmd":"addAddress","uid":"${uid}","name":"${obj.username}","phone":"${obj.phonenum}","address":"${obj.address}","addressdetail":"${obj.adr}","isdefault":"${obj.isdefault}"}`
        }
        // //console.log(url)
        wx.request({
          url: url,
          success(res) {
            //console.log(res)
            // wx.navigateTo({
            //   url: '../address/address'
            // })
            wx.navigateBack({
              delta:1
            })  
          }
        })
      }else{
        wx.showToast({
          title: '请完善信息',
          icon: 'none'
        })
      }
      
    })
    


  },
  address(e) {
    // var that = this
    // //console.log(e.detail,that.data.address)
    this.setData({
      address: e.detail
    })
  },
  username(e) {
    // //console.log(e)
    this.setData({
      username: e.detail
    })
  },
  phonenum(e) {
    // //console.log(e)

    this.setData({
      phonenum: e.detail
    })
  },
  adr(e) {
    // //console.log(e)

    this.setData({
      adr: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // //console.log(options)
    var that = this
    if(options){
      wx.setNavigationBarTitle({
        title:'编辑地址'
      })
      that.setData({
        isdefault:options.isdefault,
        address: options.address,
        username: options.name,
        phonenum: options.phone,
        adr: options.addressdetail,
        id:options.id
      })
    }else{
      that.setData({
        isdefault: 0,
    // address: '',
        username: '',
        phonenum: '',
        address: '',
        adr: '',
        disabled:true,
        id:''
      })
    }
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