// pages/scode/scose.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    type: 0,
    radio: '会员卡支付',
    total: 0,
    ordernum: '',
    body: '',
    balance: 0,
    shopid: '',
    value: '暂无可用',
    show: false,
    value1: null,
    price: 0, //优惠之前
    list: [],
    length: 0,
    reduce: 0, //减免金额
    mycouponid: '',
    types: 0,
    checked: false
  },
  coupons() {
    if (this.data.value == '暂无可用') {
      wx.showToast({
        title: '暂无优惠券',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        show: true
      })
    }
  },
  close() {
    this.setData({
      show: false
    })
  },
  goBack(e) {
    var i = e.currentTarget.dataset.index
    var list = this.data.list
    // console.log(list)
    var reduce = '-' + list[i].price + '元'
    this.setData({
      value: reduce, //选完优惠券显示的文字
      reduce: list[i].price, //减免金额
      show: false,
      types: list[i].type,
      mycouponid: list[i].mycouponid
    })
    // this.computed()
    this.toTotal()
  },
  onChange(event) {
    // console.log(event)
    this.setData({
      radio: event.detail
    });
    this.toTotal()
    console.log(this.data.radio)
  },
  bindinput(e) {
    console.log(e.detail.value) //输入金额
    this.setData({
      price: e.detail.value
    })
    this.computed()
    this.toTotal()
  },
  toTotal() {
    var total = 0
    var zhekou = app.globalData.userinfo.zhekou
    var radio = this.data.radio

    if (this.data.type == 2) {
      var price = this.data.price; //应付金额
      var reduce = this.data.reduce;
      if (zhekou) {
        if(radio == '微信支付'){
          total = price - reduce
        } else if (radio == '会员卡支付'){
          total = (price - reduce) * zhekou
          total = total.toFixed(1)
        }
      } else {
        total = price - reduce
      }
      this.setData({
        total: total
      })
    } else if (this.data.type == 1) {
      total = this.data.total
      this.setData({
        total: total
      })
    }
  },
  clickFormView(event) { //模板消息的模板
    let formid = event.detail.formId;
    if (formid && formid !== 'the formId is a mock one') {
      app.formid(formid)
    }
  },
  computed() {
    var type = this.data.type //线上或线下 线下计算
    var price = parseInt(this.data.price) //输入金额
    // console.log(price)
    var base = app.globalData.base
    var that = this
    var arr = []
    var arr1 = []
    var uid = app.globalData.uid
    wx.request({
      url: `${base}?json={"cmd":"mycouponlist","uid":"${uid}","type":"0"}`, //所有优惠券 type0未使用
      success: function(re) {
        var datas = re.data.dataList //所有的优惠券
        var price = that.data.price //输入的价格

        // console.log(datas, '过滤前')
        if (datas) {
          for (var i = 0; i < datas.length; i++) {
            datas[i].fullprice = parseInt(datas[i].fullprice)
            datas[i].price = parseInt(datas[i].price)
            if (price - datas[i].fullprice >= 0) {
              arr.push(datas[i])
              if (datas[i].type == 1) {
                arr1.push(datas[i])
              }
            }
          }
          if (app.globalData.userinfo.zhekou) {
            that.setData({
              length: arr1.length,
              list: arr1
            })
            if (that.data.length == 0) {
              that.setData({
                value: '暂无可用'
              })
            } else if (that.data.length > 0) {
              var num = that.data.length + "张可用"
              that.setData({
                value: num
              })
            }

          } else {
            that.setData({
              length: arr.length,
              list: arr
            })
            // console.log(arr)
            if (that.data.length == 0) {
              that.setData({
                value: '暂无可用'
              })
            } else if (that.data.length > 0) {
              var num = that.data.length + "张可用"
              that.setData({
                value: num
              })
            }
          }

        } else {
          that.setData({
            value: '暂无可用'
          })
        }
      }
    })
  },
  order() {
    var that = this
    var price = that.data.price
    var total = that.data.total
    var base = app.globalData.base
    var shopid = that.data.shopid
    var mycouponid = that.data.mycouponid
    var ordernum = 0
    if (this.data.type == 2) {
      app.getAuthKey().then(function(res) {
        var uid = res.data
        wx.request({
          url: `${base}?json={"cmd":"addxianxiaorder","uid":"${uid}","shopid":"${shopid}","totalprice":"${price}","actualprice":"${total}","mycouponid":"${mycouponid}"}`,
          success(res) {
            // console.log(res)
            ordernum = res.data.ordernum
            that.pay(ordernum)
          }
        })
      })
    }
  },
  formSubmit(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail)
  },
  goPay(e) {
    // console.log(e)
    var ordernum = this.data.ordernum
    this.pay(ordernum)
  },
  pay(ordernum) {
    // app.formid(form)
    var base = app.globalData.Url
    var that = this
    if (that.data.type == 2) {
      that.toTotal()
    }
    wx.showLoading({
      title: '支付中…',
    })
    var price = that.data.price
    var total = that.data.total
    // console.log(total,'微信支付金额')
    // console.log(ordernum,'订单号')
    var shopid = that.data.shopid
    var mycouponid = that.data.mycouponid
    // app.getAuthKey().then(function(res) {
    var uid = app.globalData.uid
    // console.log(url) //微信支付
    if (that.data.radio == "微信支付") {
      var data = `uid=${uid}&ordernum=${ordernum}&price=${total}` //微信 订单号 支付金额（实付） uid
      wx.request({
        url: `${base}/payment?${data}`,
        // data: data,
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          // console.log(res.data.body)
          var body = res.data.body
          wx.requestPayment({
            timeStamp: body.timeStamp,
            nonceStr: body.nonceStr,
            package: body.package,
            signType: 'MD5',
            paySign: body.paySign,
            success(res) {
              // console.log(res)
              wx.hideLoading()
              wx.redirectTo({
                url: '../paysuc/paysuc?type=' + that.data.type,
              })
            },
            fail(res) {
              wx.hideLoading()
              wx.showToast({
                title: '支付失败',
                icon: 'none',
              })
              wx.switchTab({
                url: '../index/index'
              })
            }
          })
        }
      })
    } else if (that.data.radio == "会员卡支付") {
      var data = `{"cmd":"payByBalance","uid":"${uid}","ordernum":"${ordernum}"}` //会员卡 uid 订单号
      // data=JSON.stringify(data)
      wx.request({
        url: `${base}/service?json=${data}`,
        // data: data,
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          // console.log(res)
          wx.hideLoading()
          if (res.data.result == 0) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
            })
            wx.reLaunch({
              url: '../paysuc/paysuc?type=' + that.data.type,
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '支付失败',
              icon: 'none',
            })
            // wx.switchTab({
            //   url: '../index/index'
            // })
          }
        },
        fail(res) {
          wx.hideLoading()
          wx.showToast({
            title: '支付失败',
            icon: 'none',
          })
          // wx.switchTab({
          //   url:'../index/index'
          // })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载 
   * type=1在线付款 type=2到店付款
   */
  onLoad: function(options) {
    console.log(options)
    // console.log(app.globalData.uid)
    // console.log(options) //ordernum、total
    // console.log(app.globalData.userInfo.balance)
    var balance = app.globalData.userinfo.balance
    this.setData({
      balance: balance
    })
    var type = options.type
    if (type == 2) {
      wx.setNavigationBarTitle({
        title: '到店支付',
      })
      this.setData({
        type: type,
        shopid: options.shopid
      })
      this.computed()
      this.toTotal()
    } else if (type == 1) {
      var total = options.total
      var checked = null
      if (options.isxuan != undefined){
        checked = options.isxuan
      }
      console.log(options.isxuan)
      if (options.checked != undefined) {
        checked = options.checked
      }
      if (!options.total) {
        total = options.actualprice
      }
      var ordernum = options.ordernum
      this.setData({
        type: type,
        total: total,
        checked: checked,
        ordernum: ordernum
      })
    }

    // console.log(total)

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