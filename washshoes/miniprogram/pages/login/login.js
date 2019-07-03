const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              //从数据库获取用户信息
              that.queryUsreInfo();
              //用户已经授权过
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      app.getAuthKey().then(function(res) {
        console.log(res.data)
        app.globalData.uid = res.data
        wx.setStorage({
          key: 'uid',
          data: res.data,
        })
        wx.switchTab({
          url: '../index/index',
        })
      })
    }
    //   if (e.detail.userInfo) {
    //     //用户按了允许授权按钮
    //     var that = this;
    //     //插入登录的用户的相关信息到数据库
    //     wx.login({
    //       success: function(res) {

    //         var code = res.code; //微信登录获取code
    //         // that.globalData.code = code
    //         if (code != null && code != "") {

    //           wx.getUserInfo({
    //             withCredentials: true,
    //             success: function(res_user) {
    //               // console.log(res_user)
    //               wx.request({
    //                 //后台接口地址
    //                 url: 'https://brush.lixinapp.com/washshoes/api/login',
    //                 method: 'post',
    //                 data: {
    //                   code: code,
    //                   userInfo: res_user,
    //                   pid: ""
    //                 },
    //                 header: {
    //                   'content-type': 'application/json'
    //                 },

    //                 success: function(res_success) {
    //                   console.log("微信登录" , res_success)
    //                   if (res_success.data.result != 0) {
    //                     console.log('被禁用')
    //                     wx.redirectTo({
    //                       url: '../404/404'
    //                     })


    //                   } else {
    //                     // console.log('用户的id：' + res_success.data.uid);
    //                     var uid = res_success.data.uid;
    //                     // console.log(uid)
    //                     app.globalData.uid = uid;
    //                     wx.redirectTo({
    //                       url: '../index/index',
    //                     })
    //                     var res = {
    //                       status: 200,
    //                       data: uid
    //                     }
    //                     resolve(res);
    //                     // wx.setStorageSync('openId', res_success.data.openId);
    //                   }


    //                 }
    //               })
    //             },
    //             fail: function(err) {
    //               console.log(err)
    //               wx.redirectTo({
    //                 url: '../login/login',
    //               })
    //               wx.showToast({

    //                 title: '获取信息失败',

    //                 icon: "none",

    //                 duration: 10000

    //               })

    //               setTimeout(function() {

    //                 wx.hideToast()

    //               }, 2000)
    //             },
    //             complete: function(res) {


    //             }
    //           })
    //         } else {
    //           console.log('获取用户登录态失败！' + res.errMsg);
    //           var res = {
    //             status: 300,
    //             data: '错误'
    //           }
    //           reject('error');
    //         }
    //       }
    //     })
    //     //授权成功后，跳转进入小程序首页
    else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function() {

    wx.request({
      url: `${app.globalData.Url}/service?json={"cmd":"userinfo","uid":"${app.globalData.uid}"}`,
      // data: {
      //     openid: app.globalData.openid
      // },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        // console.log(res.data);
        getApp().globalData.userInfo = res.data;
      }
    })
  },

})