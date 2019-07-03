// pages/extension/extension.js
// pages/extend/extend.js
var app = getApp();
var telarr = [];
var bgimgwidth; //背景图原图宽度
var bgimgheight; //背景图原图高度
var bghw; //背景图高宽比
var ewmimgwidth; //二维码原图宽度
var ewmimgheight; //二维码原图高度
var ewmhw //二维码高宽比
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mysrc: "",
    ewmsrc: "",
    canvasHidden: true,
    iconsrc: '',
    obj: '',
    screenWidth: "", //设备宽 高 像素比
    winHeight: "",
    showbgimgwidth: '', //背景图原图宽度
    showbgimgheight: '', //背景图原图高度
    showbghw: '', //背景图高宽比
    codeImg: ''
  },

  //获取背景图宽高
  imageLoadbg: function(e) {
    bgimgwidth = e.detail.width; //背景图原图宽度
    bgimgheight = e.detail.height; //背景图原图高度
    bghw = e.detail.height / e.detail.width;
    console.log(e)
    this.setData({
      showbgimgwidth: bgimgwidth, // * 0.9
      showbghw: bghw
    })
  },
  //获取二维吗宽高
  imageLoadewm: function(e) {
    ////console.log(e);
  },
  // 点击生成图片
  picimg: function(path) {
    // wx.showLoading({
    //   title: '正在保存图片',
    // })
    var that = this;
    var promise1 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: that.data.obj.qrcodeimage, //背景图
        success: function(sres) {
          console.log(sres)
          that.setData({
            mysrc: sres.path
          })
          // //console.log(that.data.mysrc);
          resolve(1);
          reject(2);
        }
      })
    })

    //把图片缓存到本地返回本地路径
    var promise2 = new Promise(function(resolve, reject) {
      // //console.log(that.data.datas.image);
      wx.getImageInfo({
        src: that.data.codeImg, //记得替换成image 二维码
        success: function(sres) {

          that.setData({
            ewmsrc: sres.path
          })
          //console.log(that.data.ewmsrc);
          resolve(1);
          reject(2);
        }
      })
    })

    var promise3 = new Promise(function(resolve, reject) {
      // //console.log(that.data.datas.image);
      wx.getImageInfo({
        src: that.data.obj.icon, //记得替换成image 二维码
        success: function(res) {

          that.setData({
            iconsrc: res.path
          })
          //console.log(that.data.iconsrc);
          resolve(1);
          reject(2);
        }
      })
    })
    Promise.all([
      promise1, promise2, promise3
    ]).then(res => {
      // mysrc背景图，ewmsrc二维码，iconsrc头像
      
      //showbgimgwidth原图
      var cvbgwidth = that.data.showbgimgwidth / 2 - 13;
      var cvbgheight = that.data.showbghw * cvbgwidth;
      // 截取昵称，过长的删掉
      var nik = that.data.obj.nickname.slice(0, 10)
      // 绘制一个大的画布
      const ctx = wx.createCanvasContext('myCanvas');
      //图片
      ctx.drawImage(that.data.mysrc, 0, 0, cvbgwidth, cvbgheight);
      //选择图片把图片放在画布里面依次为距离 左边 跟距离 上边，图片 宽高
      //二维码
      ctx.drawImage(that.data.ewmsrc, (cvbgwidth - cvbgwidth * 0.4) / 2, (cvbgheight - cvbgwidth * 0.85) / 2, cvbgwidth * 0.4, cvbgwidth * 0.4);
      // // 画一个白色的底部，上面放上二维码
      // ctx.setFillStyle('white')
      // ctx.fillRect(2, cvbgwidth + 55, cvbgwidth, 130)

      ctx.save();
      ctx.beginPath();
      ctx.arc(170,290, 45, 0, Math.PI * 2, false);     
      ctx.clip();
      ctx.drawImage(that.data.iconsrc, 125, 245, 90,90);
      ctx.restore();
      // // 昵称跟下面的文字
      ctx.setFontSize(15)
      ctx.setFillStyle('black')
      ctx.fillText(nik, (cvbgwidth - ctx.measureText(nik).width) / 2, cvbgheight-50)
      ctx.setFillStyle('black')
      ctx.fillText('扫码进入BURSH', (cvbgwidth - ctx.measureText('扫码进入BURSH').width) / 2, cvbgheight-25)
      ctx.draw(true, function() {
        that.save()
      })
    })
  },
  // 保存图片
  save: function() {
    let p = new Promise(function(resolve, reject) {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success(res) {
          //console.log(res.tempFilePath)
          resolve(res.tempFilePath);
          reject(2);

        }
      })
    })
    p.then(imgurl => {
      wx.getSetting({
        success(state) {
          //console.log(state);
          if (!state.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success(res) {
                //console.log(res)
                wx.saveImageToPhotosAlbum({
                  filePath: imgurl,
                  success: function(data) {
                    //console.log(data)
                    if (data.errMsg == "saveImageToPhotosAlbum:ok") {
                      wx.hideLoading();
                      wx.showToast({
                        title: '保存成功！',
                        icon: 'success',
                        duration: 2000
                      })
                    } else {
                      wx.hideLoading()
                      wx.showToast({
                        title: '保存失败',
                        icon: 'success',
                        duration: 2000
                      })
                    }

                  },
                  fail: function() {
                    wx.hideLoading()
                  }
                })
              }
            })
          } else {
            //console.log('已经授权')
            wx.saveImageToPhotosAlbum({
              filePath: imgurl,
              success: function(data) {
                //console.log(data)
                if (data.errMsg == "saveImageToPhotosAlbum:ok") {
                  wx.hideLoading()
                  wx.showToast({
                    title: '保存成功！',
                    icon: 'success',
                    duration: 2000
                  })
                } else {
                  wx.hideLoading()
                  wx.showToast({
                    title: '保存失败',
                    icon: 'success',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                wx.hideLoading()
              }
            })
          }


        }
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      codeImg: options.url
    })
    wx.showLoading({
      title: '加载中…',
    })
    var that = this

    //console.log(app.globalData.userInfo)

    var base = app.globalData.base
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"userinfo","uid":"${uid}"}`,
        success(res) {
          wx.hideLoading()
          //console.log(res.data.dataobject)
          var obj = res.data.dataobject
          that.setData({
            obj: obj
          })
          wx.getSystemInfo({
            success: res => {
              //console.log(res)
              that.setData({
                screenWidth: res.screenWidth, //获取设备宽 高 像素比 屏幕宽度，单位px
                winHeight: res.windowHeight, //设备高度 可使用窗口宽度
              })
            }
          })

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
    // wx.scanCode({
    //   success(res) {
    //     console.log(res)
    //   }
    // })
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
    return {
      title: '我的海报',
      path: 'pages/index/index?scene=' + app.globalData.uid
    }
  }
})