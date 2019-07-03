//index.js
const app = getApp()
// var uid = app.globalData.uid
Page({

  data: {
    imgUrls: [
      // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      // 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    popup: true, //true不弹广告
    cleanimage: '',
    repairimage: '',
    customizedimage: '',
    memberimage: "", // 开通会员图片
    couponimage: "", // 领券中心图片
    specialareaimage: "", // 清洗专区图片
    repairareaimage: "", // 修复专区图片
    customizedareaimage: "", // 定制专区图片
    couponobj: {},
    uid: ''
  },
  hidePopup(flag = true) {
    this.setData({
      "popup": flag
    });
  },

  /* 显示弹窗 */
  showPopup() {
    this.hidePopup(false);
  },
  fast() {
    wx.navigateTo({
      url: '../fast/fast',
    })
  },
  goCou() {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  goSer() {
    wx.navigateTo({
      url: '../service/service',
    })
  },
  goNew(e) {
    var base = app.globalData.base
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showLoading({
      title: '领取中',
    })
    app.getAuthKey().then(function(res) {
      var uid = res.data
      // console.log(url)
      wx.request({
        url: `${base}?json={"cmd":"receivecoupon","uid":"${uid}","couponid":"${id}"}`, //新用户优惠券
        success: res => {
          console.log(res)
          // this.setData({
          //   couponobj:res.data.dataobject
          // })

          // wx.navigateTo({
          //   url: '../vip/vip',
          // })
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1500
          })
          that.setData({
            "popup": true
          });

        }
      })
    })

  },
  goBanner(e) {
    var id = e.currentTarget.dataset.id;
    wx.setStorageSync('banner', this.data.imgUrls)
    wx.navigateTo({
      url: '../banner/banner?id=' + id,
    })
  },
  goDet(e) {
    // console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  },
  goVip() {
    // var base = app.globalData.base
    // wx.showLoading({
    //   title: '领取中',
    // })
    // wx.request({
    //   url:`${base}?json={"cmd":"receivecoupon"}`,//新用户优惠券
    //   success: res =>{
    //     // console.log(res.data.dataobject)
    //     // this.setData({
    //     //   couponobj:res.data.dataobject
    //     // })

    wx.navigateTo({
      url: '../vip/vip',
    })
  },

  onLoad: function(options) {
    console.log(options)
    if(options.scene){
      app.globalData.codes = decodeURIComponent(options.scene)
    }
    var that = this;
    // var page = getCurrenstPages() 当前页面信息
    // console.log(page)
    app.getAuthKey().then(function(res) { //用户信息
      var uid = res.data
      // console.log(res)
      var base = app.globalData.base

      wx.request({
        url: `${base}?json={"cmd":"userinfo","uid":"${uid}"}`,
        success(res) {
          var obj = res.data.dataobject
          // console.log(obj)
          app.globalData.userinfo = obj //全局用户信息
          // console.log(app.globalData.userinfo)
          if (obj.isnew == 1) {
            that.setData({
              popup: true
            })
          } else {
            that.setData({
              popup: false
            })
          }
        }
      })
    })
    var uid = this.data.uid
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.uid) {
      var base = app.globalData.base
      // console.log(uid)
      wx.request({
        url: `${base}?json={"cmd":"homepage"}`,
        success: res => {
          // console.log(res)
          // console.log(res.data)
          wx.hideLoading()

          this.setData({
            imgUrls: res.data.dataList,
            cleanimage: res.data.cleanimage,
            repairimage: res.data.repairimage,
            customizedimage: res.data.customizedimage,
            memberimage: res.data.memberimage,
            couponimage: res.data.couponimage,
            specialareaimage: res.data.specialareaimage,
            repairareaimage: res.data.repairareaimage,
            customizedareaimage: res.data.customizedareaimage
          })
        }
      })
      wx.request({
        url: `${base}?json={"cmd":"getnewcoupon"}`, //新用户优惠券
        success: res => {
          // console.log(res.data.dataobject)

          var obj = res.data.dataobject
          // console.log(obj)
          var price = obj.price
          var fullprice = obj.fullprice
          obj.fullprice = parseInt(fullprice)
          obj.price = parseInt(price)
          // console.log(obj)
          that.setData({
            couponobj: obj
          })
        }
      })

      // 获取用户信息
    } else {
      app.getAuthKey().then(function(res) {
        var base = app.globalData.base
        wx.request({
          url: `${base}?json={"cmd":"homepage"}`,
          success: res => {
            // console.log(res)
            // console.log(res.data)
            wx.hideLoading()
            that.setData({
              imgUrls: res.data.dataList,
              cleanimage: res.data.cleanimage,
              repairimage: res.data.repairimage,
              customizedimage: res.data.customizedimage,
              memberimage: res.data.memberimage,
              couponimage: res.data.couponimage,
              specialareaimage: res.data.specialareaimage,
              repairareaimage: res.data.repairareaimage,
              customizedareaimage: res.data.customizedareaimage
            })
          }
        })
        wx.request({
          url: `${base}?json={"cmd":"getnewcoupon"}`, //新用户优惠券
          success: res => {
            // console.log(res.data.dataobject)

            var obj = res.data.dataobject
            // console.log(obj)
            var price = obj.price
            var fullprice = obj.fullprice
            obj.fullprice = parseInt(fullprice)
            obj.price = parseInt(price)
            // console.log(obj)
            that.setData({
              couponobj: obj
            })
          }
        })

      })
    }
  },

  // onGetUserInfo: function(e) {
  //   if (!that.logged && e.detail.userInfo) {
  //     that.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })
  //   }
  // }
})