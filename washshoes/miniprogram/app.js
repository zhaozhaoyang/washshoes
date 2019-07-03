//app.js
//app.js
var uid = "";
App({
  onLaunch: function() {
    // 展示本地存储能力
    var that = this
  },
  // 用户授权登录
  getAuthKey: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      wx.login({
        success: function(res) {
          console.log(res)
          var code = res.code; //微信登录获取code
          that.globalData.code = code
          if (code != null && code != "") {
            wx.getUserInfo({                                                 
              withCredentials: true,
              success: function(res_user) {
                that.globalData.userInfo = res_user
                wx.request({
                  //后台接口地址
                  url: 'https://xcx.brush666.com/washshoes/api/login',
                  method: 'post',
                  data: {
                    code: code,
                    userInfo: res_user,
                    pid: that.globalData.codes
                  },
                  header: {
                    'content-type': 'application/json'
                  },

                  success: function(res_success) {
                    // console.log("微信登录" + JSON.stringify(res_success))
                    if (res_success.data.result != 0) {
                      console.log('被禁用')
                      wx.redirectTo({
                        url: '../404/404'
                      })
                    } else {
                      // console.log('用户的id：' + res_success.data.uid);
                      uid = res_success.data.uid;
                      that.globalData.uid = uid;
                      wx.setStorage({
                        key: 'uid',
                        data: uid,
                      })
                      wx.redirectTo({
                        url: '../index/index',
                      })
                      var res = {
                        status: 200,
                        data: uid
                      }
                      resolve(res);
                      wx.setStorageSync('uid', res_success.data.uid);
                    }
                  }
                })
              },
              fail: function(err) {
                console.log(err)
                wx.redirectTo({
                  url: '../login/login',
                })
                wx.showToast({
                  title: '获取信息失败',
                  icon: "none",
                  duration: 10000
                })
                setTimeout(function() {
                  wx.hideToast()
                }, 2000)
              },
              complete: function(res) {}
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg);
            var res = {
              status: 300,
              data: '错误'
            }
            reject('error');
          }
        }
      })
    })
  },
  formid: function(formid) {
    // console.log(e)
    // var formid = e.detail.formid
    var that = this;
    var a = {
      cmd: "uploadFromid",
      fromid: formid,
      uid: that.globalData.uid
    }
    var str = JSON.stringify(a);
    var url = `${that.globalData.base}?json=${str}`
    // console.log(url)
    wx.request({
      url: url,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencode;charset=utf-8',
      },
      success: function(res) {
        console.log(res)
      }
    })
  },
  globalData: {
    appid: 'wx6b2c28832f9c949b',
    secret: '4f2c640aa6b4997f0a051444e6bc4e4e',
    userInfo: null,
    code: '',
    uid: uid,
    base: 'https://xcx.brush666.com/washshoes/api/service',
    baseUrl: 'https://xcx.brush666.com/washshoes/api/uploadFile',
    Url: 'https://xcx.brush666.com/washshoes/api',
    avatarUrl: '',
    defaultAddr: '',
    // is_auth: 0  //登录后返回的授权状态：0未授权，1已授权
    userinfo: {},
    preview: [],
    list: [],
    address: "",
    allPrice: 0,
    codes: ''
  }
})