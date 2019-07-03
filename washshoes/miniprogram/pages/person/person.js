// pages/person/person.js
var app = getApp();
var uid = app.globalData.uid;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    list: [],
    // tempFilePaths: "",
    userInfo: '',
    avatarUrl: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    obj: '',
    icon: '',
    disabled: true,
    nick: '',
    oldNick: '',
    avatar: '',
    codeImg: ''
  },
  changeName(e) {
    //console.log(e)
    this.setData({
      disabled: false
    })


  },
  onClose() {
    this.setData({
      show: false
    });
  },
  change() {
    this.setData({
      show: true
    })
  },
  cancel() {
    this.setData({
      show: false
    });
  },
  onClose(event) {
    if (event.detail === 'confirm') {
      // 异步关闭弹窗
      setTimeout(() => {
        this.setData({
          show: false
        });
      }, 1000);
    } else {
      this.setData({
        show: false
      });
    }
  },
  goExten(event) {
    // //console.log(event.target)
    var obj = this.data.obj
    var codeImg = this.data.codeImg
    wx.navigateTo({
      url: '../extension/extension?url=' + codeImg
    })
  },
  scanCode() { //点击扫码
    var that = this;
    setTimeout(function() {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          //console.log(res)
          var shopid = res.result
          var base = app.globalData.base
          var json = {
            cmd: 'verificationshop',
            shopid: shopid
          }
          json = JSON.stringify(json)
          var json = {
            cmd: 'verificationshop',
            shopid: shopid
          }
          json = JSON.stringify(json)
          var url = `${base}?json=${json}`
          wx.request({
            url: url,
            success(res) { //验证成功两种情况，是或者不是
              if (res.data.isshop == 1) {
                //console.log(res)
                wx.hideLoading()
                wx.navigateTo({
                  url: '../scode/scode?type=' + 2 + '&shopid=' + shopid,
                })
              } else {
                wx.showToast({
                  title: '请扫描商家二维码',
                  icon: "none"
                })
                // wx.reLaunch({
                //   url: '../index/index',

                // });
              }
            },
            fail(res) { //验证失败，肯定不是
              //console.log(res)
              wx.showToast({
                title: '请扫描商家二维码',
                icon: "none"
              })
              // wx.reLaunch({
              //   url: '../index/index',

              // });
            }
          })
        },
        fail(res) {
          //console.log(res)
          wx.showToast({
            title: '扫码失败',
            icon: "none",
            duration: 1000
          })
          // wx.reLaunch({
          //   url: '../index/index'
          // })
        }
      })
    }, 500)

  },
  goVip() {
    wx.navigateTo({
      url: '../vip/vip'
    })
  },
  upLoad() {},
  getpath: function(url) {
    var that = this;
    var list = []
    var base = app.globalData.base

    wx.uploadFile({
      url: app.globalData.baseUrl,
      filePath: url,
      name: 'file',
      formData: {},
      success(res) {
        const data = JSON.parse(res.data);
        //console.log(data) //data.dataobject
        that.setData({
          icon: app.globalData.avatarUrl + data.dataobject,
          avatar: data.dataobject
        })
        // var arr = that.data.arr
        // var commentimages=that.data.commentimages
        // arr.push(app.globalData.avatarUrl+data.dataobject)
        // commentimages.push(data.dataobject)
        // that.setData({
        //   arr:arr,
        //   commentimages:commentimages
        // })
        var uid = app.globalData.uid
        var avatar = that.data.avatar
        var url = `${base}?json={"cmd":"updateicon","uid":"${uid}","icon":"${avatar}"}`
        //console.log(url)
        wx.request({
          url: url, //仅为示例，非真实的接口地址
          // filePath: tempFilePaths[0],
          // name: 'file',
          // formData: {
          //   'user': 'test'
          // },
          success: function(res) {
            var data = res.data
            //do something
            //console.log(res.data,"success")
          }
        })

      }
    })


  },
  goAmb() { //相册选择照片
    var base = app.globalData.base
    var that = this

    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          //console.log(tempFilePaths)
          that.setData({
            show: false,
            icon: res.tempFilePaths[0]
          })
          that.getpath(tempFilePaths[0])

          // wx.setStorage({
          //   key: "tempFilePaths",
          //   value: tempFilePaths[0]
          // })

        }
      })

    })

  },
  goSet() {
    wx.navigateTo({
      url: '../setting/setting'
    })
  },
  goCen() {
    wx.navigateTo({
      url: '../center/center'
    })
  },
  bindfocus() {
    //console.log(this.data.oldNick)
    var self = this
    this.setData({
      nick: self.data.oldNick
    })
  },
  // 修改姓名
  bindblur(e) {
    // //console.log(e.detail.value)
    var value = e.detail.value
    if (e.detail.value.length > 10) {
      let str = e.detail.value.substr(0, 6) + '...'
      this.setData({
        nick: str
      })
    } else {
      this.setData({
        nick: e.detail.value
      })
    }
    var base = app.globalData.base
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"updatenickname","uid":"${uid}","nickname":"${value}"}`,

        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          //console.log(res)

        }
      })

    })

  },
  takephoto() {
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['camera'],
    //   success(res) {
    //     // tempFilePath可以作为img标签的src属性显示图片
    //     const tempFilePaths = res.tempFilePaths
    //   }
    // })
    var base = app.globalData.base
    var that = this
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          //console.log(tempFilePaths)
          that.setData({
            show: false,
            icon: res.tempFilePaths[0]
          })
          wx.uploadFile({
            url: `${base}?json={"cmd":"updateicon","uid":"${uid}","icon":"${tempFilePaths[0]}"}`, //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {},
            success: function(res) {
              var data = res.data
              //do something
              //console.log(res.data,"success")
              that.getpath(tempFilePaths[0])

            }
          })
          // wx.setStorage({
          //   key: "tempFilePaths",
          //   value: tempFilePaths[0]
          // })

        }
      })

    })
  },
  goOrder(e) {
    // //console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../order/order?id=' + id,
    })
  },
  goEva() {
    wx.navigateTo({
      url: '../evaluate/evaluate',
    })
  },
  goExt() {
    wx.navigateTo({
      url: '../mine/mine',
    })
  },
  goCou() {
    wx.navigateTo({
      url: '../coupons/coupons',
    })
  },
  goAdd() {
    wx.navigateTo({
      url: '../address/address',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // //console.log(app.globalData.uid)
    // //console.log(app.globalData.userInfo)
    // this.setData({
    //   icon:app.globalData.userInfo.avatarUrl
    // })
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var base = app.globalData.base
    // var userInfo=app.globalData.userInfo
    // //console.log(userInfo)
    wx.setNavigationBarTitle({
      title: 'BRUSH',
    })
    // 用户信息
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"userinfo","uid":"${uid}"}`,
        success(res) {
          console.log(res)
          wx.hideLoading()
          // //console.log(res.data.dataobject)
          var obj = res.data.dataobject
          that.setData({
            oldNick: res.data.dataobject.nickname,
            codeImg: res.data.dataobject.qrcode
          })
          if (obj.usertype == 0) {
            obj.usertype = "铁刷会员"
          } else if (obj.usertype == 1) {
            obj.usertype = "铜刷会员"
          } else if (obj.usertype == 2) {
            obj.usertype = "钢刷会员"
          } else if (obj.usertype == 3) {
            obj.usertype = "银刷会员"
          } else if (obj.usertype == 4) {
            obj.usertype = "金刷会员"
          }



          // //console.log(that.data.oldNick)
          if (obj.nickname.length > 10) {
            let str = obj.nickname.substr(0, 6) + '...'
            that.setData({
              nick: str
            })
          } else {
            that.setData({
              nick: obj.nickname
            })
          }
          that.setData({
            obj: obj,
            icon: obj.icon
          })
        }
      })
      // 发起网络请求
      // wx.request({
      //   url: `${base}/login?json={"cmd":"login","pid":"${code}"}`,

      //   header: {
      //         'content-type': 'application/json' // 默认值
      //       },
      //       success(res) {
      //         // //console.log(res)
      //         // that.setData({
      //         //   list:res.data.dataobject
      //         // })
      //         wx.hideLoading()
      //       }
      // })
      // } else {
      //   //console.log('登录失败！' + res.errMsg)
      // }

    })





    // wx.login({

    //   success(res) {
    //     // //console.log("code:", res.code)
    //     var code = res.code
    //     if (res.code) {
    //       wx.request({
    //         url: `${base}?json={"cmd":"userinfo","uid":"1"}`,
    //         success(res) {
    //           wx.hideLoading()
    //           // //console.log(res.data.dataobject)
    //           var obj = res.data.dataobject
    //           that.setData({
    //             obj: obj,
    //             icon:obj.icon
    //           })
    //         }
    //       })
    //       // 发起网络请求
    //       // wx.request({
    //       //   url: `${base}/login?json={"cmd":"login","pid":"${code}"}`,

    //       //   header: {
    //       //         'content-type': 'application/json' // 默认值
    //       //       },
    //       //       success(res) {
    //       //         // //console.log(res)
    //       //         // that.setData({
    //       //         //   list:res.data.dataobject
    //       //         // })
    //       //         wx.hideLoading()
    //       //       }
    //       // })
    //     } else {
    //       //console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success(res) {
    //           // //console.log(res.userInfo)
    //         }
    //       })
    //     }
    //   }
    // })
  },
  bindGetUserInfo(e) {
    // //console.log(e.detail.userInfo)

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