// pages/orderdetail/orderdetail.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageURL: '../../images/tu2x.png',
    list: [], //渲染优惠券列表
    list1: [],
    goodslist: [],
    addr: '',
    shop: '',
    msg: '',
    num: 0,
    total: 0,
    yunfei: 20,
    disabled: false,
    checked: false,
    oldprice: 0,
    coupon: {},
    value: "暂无可用",
    length: 0,
    type: 0,
    types: 0,
    show: false,
    value1: 0,
    mycouponid: '',
    userinfo: {},
    goodsPrice: 0,
    isxuan: 0
  },
  goChoos() {
    wx.navigateTo({
      url: '../choose/choose',
    })
  },
  goBack(e) { //选择优惠券
    // //console.log(e)
    var i = e.currentTarget.dataset.index
    var list = this.data.list
    //console.log(list)
    var reduce = '-' + list[i].price + '元'
    this.setData({
      value: reduce, //选完优惠券显示的文字
      value1: list[i].price, //减免金额
      show: false,
      types: list[i].type,
      mycouponid: list[i].mycouponid
    })
    this.toTotal()
  },
  coupons() { //选优惠券
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
  menuClick: function(e) {
    // //console.log(e)
    // var id = e.target.dataset.id
    // this.data.list[i].num=e.target.dataset.num
    this.setData({
      num: e.target.dataset.num,
      // id: e.target.dataset.id
    })
    if (this.data.num == 0) {
      this.setData({
        yunfei: 20
      })
    } else {
      this.setData({
        yunfei: 0
      })
    }
    this.toTotal()
  },
  onChange(event) {
    var that = this
    if (event.detail) {
      this.setData({
        isxuan: 1
      })
    } else {
      this.setData({
        isxuan: 0
      })
    }
    console.log(event.detail)
    console.log(this.data.isxuan)
    this.setData({
      checked: event.detail
    });
    var checked = this.data.checked
    this.setData({
      value1: 0 //点选让优惠券减免重置
    })
    this.computed()
    this.toTotal()
    //剪过
  },
  bindblur(e) {
    this.setData({
      msg: e.detail.value
    })
  },
  toTotal() { //结算总价
    var num = 0;
    var goodslist = this.data.goodslist;
    var value1 = this.data.value1
    // //console.log(goodslist)
    for (var i = 0; i < goodslist.length; i++) {
      num += goodslist[i].value * goodslist[i].goodsprice
    }
    num += this.data.yunfei
    // console.log(num)
    this.setData({
      oldprice: num //原价
    })
    if (this.data.checked) {
      var zhekou = app.globalData.userinfo.zhekou
      num = (zhekou - 0) * (num - (value1 - 0))
      console.log(num)
    } else {
      num = num - (value1 - 0)
      // console.log(num)
    }
    // console.log(num)
    // console.log(typeof num)
    num = (num - 0).toFixed(2)
    this.setData({
      total: num //优惠后的价
    })
  },
  clickFormView(event) { //模板消息的模板 点击form获取formId
    let formid = event.detail.formId;
    if (formid && formid !== 'the formId is a mock one') {
      app.formid(formid)
    }
  },
  computed() { //计算几张可用
    var that = this
    var base = app.globalData.base
    var uid = app.globalData.uid
    var arr = []
    var arr1 = []
    wx.request({
      url: `${base}?json={"cmd":"mycouponlist","uid":"${uid}","type":"0"}`, //所有优惠券 type0未使用
      success: function(re) {
        var datas = re.data.dataList //数据列表
        var price = that.data.oldprice //原价
        // //console.log(datas,'/n',price)

        // //console.log(datas, '过滤前')
        if (datas) {
          for (var i = 0; i < datas.length; i++) {
            datas[i].fullprice = parseInt(datas[i].fullprice)
            datas[i].price = parseInt(datas[i].price)

            if (price - datas[i].fullprice >= 0) { //先判断价格满足条件的
              arr.push(datas[i])
              // //console.log('知性美？')
              if (datas[i].type == 1) {
                arr1.push(datas[i]) //
              }
            }
          }
          if (that.data.checked) {
            that.setData({
              length: arr1.length,
              list: arr1,
              mycouponid: ''
            })
            // //console.log(arr)
            if (that.data.length == 0) {
              that.setData({
                value: '暂无可用',
                mycouponid: ''
              })
            } else if (that.data.length > 0) {
              var num = that.data.length + "张可用"
              that.setData({
                value: num,
                mycouponid: ''
              })
            }

          } else {
            that.setData({
              length: arr.length,
              list: arr,
              mycouponid: ''
            })
            // //console.log(arr)
            if (that.data.length == 0) {
              that.setData({
                value: '暂无可用',
                mycouponid: ''
              })
            } else if (that.data.length > 0) {
              var num = that.data.length + "张可用"
              that.setData({
                value: num,
                mycouponid: ''
              })
            }
          }
        } else {
          that.setData({
            value: '暂无可用',
            mycouponid: ''
          })
        }
      }
    })

  },
  // 提交订单
  onSubmit() {
    // //console.log('提交')
    wx.showLoading({
      title: '提交中',
      mask: 'true'
    })
    var goodslist = this.data.goodslist
    var goodscarlist = []
    var mycouponid = this.data.mycouponid
    if (!mycouponid) {
      mycouponid = ""
    }
    for (let i = 0; i < goodslist.length; i++) {
      goodscarlist.push(goodslist[i].goodscarid)
    }
    goodscarlist = JSON.stringify(goodscarlist)
    // //console.log(goodscarlist)
    var base = app.globalData.base
    var that = this
    that.toTotal()
    var total = that.data.total //商品底价加快递费
    var oldprice = that.data.oldprice
    //实付金额(原价减去折扣减去优惠券)
    var shopid = this.data.shop.shopid
    var addressid = this.data.addr.addressid
    var msg = this.data.msg
    var type = this.data.num
    var yunfei = this.data.yunfei
    var isxuan = this.data.isxuan
    if (!shopid) {
      wx.showToast({
        title: '请选择商家',
        icon: "none"
      })
      return
    }
    if (!addressid) {
      wx.showToast({
        title: '请选择地址',
        icon: "none"
      })
      return
    }
    app.getAuthKey().then(function(res) {
      var uid = res.data
      // //console.log(url)
      var url = `${base}?json={"cmd":"submissionorder","uid":"${uid}","goodscarlist":${goodscarlist},"shopid":"${shopid}","addressid":"${addressid}","type":"${type}","kuaidifei":"${yunfei}","mycouponid":"${mycouponid}","message":"${msg}","totalprice":"${oldprice}","actualprice":"${total}","isxuan":"${isxuan}"}`
      wx.request({
        url: url,
        methold: "POST",
        success(res) {
          wx.hideLoading()
          if (res.data.result == 0) {
            wx.redirectTo({ //redirectTo注销当前页面
              url: '../scode/scode?type=' + 1 + `&total=${that.data.total}` + `&ordernum=${res.data.ordernum}` + `&checked=${that.data.checked}`,
            })
          } else {
            wx.showToast({
              title: '下单失败',
              duration: 2000
            })
          }

          wx.removeStorage({
            key: 'selectedArr',
            success: function(res) {},
          })
        },
        fail(res) {
          //console.log(res)
          wx.showToast({
            title: '下单失败',
            duration: 2000
          })
        }

      })


    })

  },
  goAddr() {
    wx.navigateTo({
      url: '../address/address',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(this.data.userinfo)
    // //console.log(app.globalData.userInfo)
    // //console.log(app.globalData.address)
    wx.showLoading({
      title: '加载中',
    })

    if (options.type) {
      that.setData({
        type: options.type
      })
    }
    // wx.getStorage({
    //   key: 'selectedArr', //商品信息
    //   success: function(res) {
    //     console.log(res)
    //     that.setData({
    //       goodslist: res.data
    //     })
    //   }
    // })

    // wx.getStorage({
    //   key: 'shop', //商店地址
    //   success: function(res) {
    //     var shop = res.data
    //     if (shop) {
    //       that.setData({
    //         shop: shop
    //       })
    //     }
    //   }
    // })
    that.toTotal()
    that.computed()
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
    this.setData({
      userinfo: app.globalData.userinfo,
      goodsPrice: app.globalData.allPrice
    })
    var that = this
    var base = app.globalData.base
    app.getAuthKey().then(function (res) {
      var uid = res.data
      that.setData({
        uid: res.data
      })
      wx.request({
        url: `${base}?json={"cmd":"myAddressList","uid":"${uid}"}`,
        success: function (res) {
          console.log(res)
          var data = res.data.dataList
          // //console.log(data)
          wx.hideLoading()
          if (data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].isdefault == 1) {
                that.setData({
                  addr: data[i]
                })
              }
            }
          } else {
            that.setData({
              addr: ''
            })
          }
        }
      })

    })
    // //console.log(app.globalData.address)
    var addr = this.data.addr
    //console.log(addr)
    if (app.globalData.address != "") {
      this.setData({
        addr: app.globalData.address
      })
    } else {
      //console.log('没执行吗')
      this.setData({
        addr: addr
      })
    }
    var that = this
    wx.getStorage({
      key: 'selectedArr',
      success: function(res) {
        // //console.log(res.data) //商品信息
        that.setData({
          goodslist: res.data
        })
        that.toTotal()
      },
    })

    wx.getStorage({
      key: 'shop', //商店地址
      success: function(res) {
        // //console.log(res.data)
        var shop = res.data
        if (shop) {
          that.setData({
            shop: shop
          })
        }
      },
    })
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
    // wx.removeStorage('')
    // wx.removeStorageSync('coupon')
    // //console.log('123324')
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