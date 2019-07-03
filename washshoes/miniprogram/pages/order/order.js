// pages/order/order.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageURL: '../../images/tu2x.png',
    show: false,
    array: ['美国', '中国', '巴西', '日本'],
    list: [], //所有订单
    list1: [],
    active: 0,
    index: -1,
    value: '',
    ordernum: 0,
    i: 0,
    page: 1,
    count: 10
  },
  goLogist(e) {
    //console.log(e)
    var id = e.currentTarget.dataset.id;
    var logistics = e.currentTarget.dataset.logistics
    var logisticsnum = e.currentTarget.dataset.logisticsnum

    wx.navigateTo({
      url: `../logistics/logistics?ordernum=${id}&logistics=${logistics}&logisticsnum=${logisticsnum}`
    })
  },
  bindblur(e) {
    // //console.log(e)
    this.setData({
      value: e.detail.value
    })
  },
  onChange(e) { //点击填写物流单号
    var that = this
    this.setData({
      show: true,
      ordernum: e.currentTarget.dataset.id,
      i: e.currentTarget.dataset.index
    })
    //console.log(e)
    var base = app.globalData.base
    wx.request({
      url: `${base}?json={"cmd":"getlogistics"}`,
      success: function(res) {
        var data = res.data.dataList
        //console.log(data)
        that.setData({
          array: data
        })
        // wx.hideLoading()
      }
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onCancel() {
    this.setData({
      show: false
    })
  },
  onConfirm() {
    var that = this
    var value = this.data.value
    var index = this.data.index
    var ordernum = this.data.ordernum
    if (!value) {
      wx.showToast({
        title: '请输入快递单号',
        icon: 'none'
      })
      return
    }
    if (index == -1) {
      wx.showToast({
        title: '请选择快递公司',
        icon: 'none'
      })
      return
    }
    that.setData({
      show: false
    })
    wx.showLoading({
      title: '加载中…',
    })
    var logisticsnum = this.data.array[index].logisticsnum
    app.getAuthKey().then(function(res) {
      var uid = res.data
      var base = app.globalData.base
      var url = `${base}?json={"cmd":"mailorder","uid":"${uid}","ordernum":"${ordernum}","logisticsnum":"${logisticsnum}","logistics":"${value}"}`
      wx.request({
        url: url,
        success(res) {
          //console.log(res)
          var list = that.data.list
          var i = that.data.i
          list.splice(i, 1)
          that.setData({
            list: list
          })
          wx.hideLoading() //刷新页面
        }
      })
    })

  },
  goPay(e) {
    // //console.log(e)
    var actualprice = e.currentTarget.dataset.actualprice;
    var ordernum = e.currentTarget.dataset.id;
    var isxuan = e.currentTarget.dataset.isxuan;
    console.log(isxuan)
    wx.navigateTo({
      url: `../scode/scode?actualprice=${actualprice}&ordernum=${ordernum}&type=1&isxuan=${isxuan}`
    })
  },
  sure(e) {
    var id = e.currentTarget.dataset.id;
    var i = e.currentTarget.dataset.index
    var that = this
    app.getAuthKey().then(function(res) {
      var uid = res.data
      var list = that.data.list
      var base = app.globalData.base
      wx.request({
        url: `${base}?json={"cmd":"confirmorder","uid":"${uid}","ordernum":"${id}"}`,
        success(res) {
          //console.log(res)
          list.splice(i, 1)
          that.setData({
            list: list
          })
          wx.showToast({
            title: '确认收货成功'
          })
        }
      })

    })
  },
  goCom(e) {
    var id = e.currentTarget.dataset.id; //订单号
    wx.navigateTo({
      url: '../comment/comment?id=' + id
    })
  },
  goBuCha(e) {
    //console.log(e)
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    var total = list[index].chajia
    //console.log(total)
    var id = e.currentTarget.dataset.id;
    app.getAuthKey().then(function(res) {
      var uid = res.data
      var base = app.globalData.base;
      var json = {
        cmd: 'buchaorder',
        uid: uid,
        ordernum: id
      }
      json = JSON.stringify(json)
      var url = `${base}?json=${json}`
      wx.request({
        url: url,
        success(res) {
          //console.log(res)
          var ordernum = res.data.ordernum
          wx.navigateTo({
            url: `../scode/scode?type=1&ordernum=${ordernum}&total=${total}`
          })
        }
      })

    })
  },
  clickFormView(event) { //模板消息的模板
    let formid = event.detail.formId;
    if (formid && formid !== 'the formId is a mock one') {
      app.formid(formid)
    }
  },
  change(e) {
    this.setData({
      list: []
    })
    // //console.log(e.detail.index) 0-5
    var index = e.detail.index
    var that = this
    var state = index - 1
    // //console.log(state)
    wx.showLoading({
      title: '加载中…',
    })
    var base = app.globalData.base
    app.getAuthKey().then(function(res) {
      var uid = res.data
      // //console.log(url)
      if (index == 0) {
        wx.request({
          url: `${base}?json={"cmd":"myorderlist","uid":"${uid}","state":"","nowPage":"1","pageCount":"10"}`,
          success: function(res) {
            var data = res.data.dataList
            if (data) {
              for (let i = 0; i < data.length; i++) {
                if (data[i].state == 0) {
                  data[i].state = '待付款'
                }
                if (data[i].state == 1) {
                  data[i].state = '待评估'

                }
                if (data[i].state == 2) {
                  data[i].state = '待补差'

                }
                if (data[i].state == 3) {
                  data[i].state = '待邮寄'


                }
                if (data[i].state == 4) {
                  data[i].state = '已邮寄'

                }
                if (data[i].state == 5) {
                  data[i].state = '待完成'

                }
                if (data[i].state == 6) {
                  data[i].state = '待收货'
                }
                if (data[i].state == 7) {
                  data[i].state = '待评价'
                }
                if (data[i].state == 8) {
                  data[i].state = '已评价'
                }
                if (data[i].state == 9) {
                  data[i].state = '已取消'
                  // data.splice(i,1)
                  // //console.log(data)

                }
              }
              // //console.log(data)
              that.setData({
                list: data
              })
            } else {
              that.setData({
                list: ''
              })
            }
            wx.hideLoading()

          }
        })
      } else if (index > 0 && index < 6) {
        wx.request({
          url: `${base}?json={"cmd":"myorderlist","uid":"${uid}","state":"${state}","nowPage":"1","pageCount":"10"}`,
          success: function(res) {
            var data = res.data.dataList
            //console.log(data)
            if (data) {
              for (let i = 0; i < data.length; i++) {
                if (data[i].state == 0) {
                  data[i].state = '待付款'
                }
                if (data[i].state == 1) {
                  data[i].state = '待评估'

                }
                if (data[i].state == 2) {
                  data[i].state = '待补差'

                }
                if (data[i].state == 3) {
                  data[i].state = '待邮寄'


                }
                if (data[i].state == 4) {
                  data[i].state = '已邮寄'

                }
                if (data[i].state == 5) {
                  data[i].state = '待完成'

                }
                if (data[i].state == 6) {
                  data[i].state = '待收货'
                }
                if (data[i].state == 7) {
                  data[i].state = '待评价'
                }
                if (data[i].state == 8) {
                  data[i].state = '已评价'
                }
                if (data[i].state == 9) {
                  data[i].state = '已取消'
                  // data.splice(i,1)
                }
              }
              that.setData({
                list: data
              })
            } else {
              that.setData({
                list: ''
              })
            }
            wx.hideLoading()
          }
        })
      } else {
        wx.request({
          url: `${base}?json={"cmd":"myxianxiaorderlist","uid":"${uid}"}`,
          success: function(res) {
            var data = res.data.dataList
            //console.log(data)
            if (data) {
              that.setData({
                list1: data
              })
            } else {
              that.setData({
                list1: ''
              })
            }
            wx.hideLoading()

          }
        })
      }
    })


  },
  loadMore() {
    var page = this.data.page + 1
    var list = this.data.list //加载之前的
    // var count = 4*page
    this.setData({
      page: page,
      // count:count
    })
    this.getList()
    var list1 = this.data.list
    list = list.concat(list1)
    this.setData({
      list: list
    })
  },
  cancel(e) { //取消订单
    // //console.log(e.currentTarget.dataset)
    var id = e.currentTarget.dataset.id;
    var base = app.globalData.base;
    wx.redirectTo({
      url: '../cancel/cancel?id=' + id,
    })

  },
  bindPickerChange(e) {
    // //console.log('picker发送选择改变，携带值为', e.detail.value)
    //console.log(e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  goDet(e) {
    //console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../orderdetail/orderdetail?id=" + id
    })
  },
  getList() {
    var base = app.globalData.base
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var id = that.data.active
    var state = id - 1
    app.getAuthKey().then(function(res) {
      var uid = res.data
      var page = that.data.page
      var count = that.data.count
      if (id == 0) { //点击全部订单进入
        wx.request({
          url: `${base}?json={"cmd":"myorderlist","uid":"${uid}","state":"","nowPage":"${page}","pageCount":"${count}"}`,
          success: function(res) {
            var data = res.data.dataList
            console.log(data) //直接点进去时请求到的数据
            if (data) {
              var arr = []
              for (let i = 0; i < data.length; i++) {
                if (data[i].state == 0) {
                  data[i].state = '待付款'

                }
                if (data[i].state == 1) {
                  data[i].state = '待评估'

                }
                if (data[i].state == 2) {
                  data[i].state = '待补差'

                }
                if (data[i].state == 3) {
                  data[i].state = '待邮寄'


                }
                if (data[i].state == 4) {
                  data[i].state = '已邮寄'

                }
                if (data[i].state == 5) {
                  data[i].state = '待完成'

                }
                if (data[i].state == 6) {
                  data[i].state = '待收货'
                }
                if (data[i].state == 7) {
                  data[i].state = '待评价'
                }
                if (data[i].state == 8) {
                  data[i].state = '已评价'
                }
                if (data[i].state == 9) {
                  data[i].state = '已取消'
                  // //console.log(data[i])
                  // data.splice(i,1)
                  // //console.log(i)
                }
              }
              console.log(data)
              that.setData({
                list: data
              })
            } else {
              that.setData({
                list: ''
              })
            }
            wx.hideLoading()
          }
        }) //待付款传0，1待邮寄 2进行中 3待收货 4待评价(传空是所有)
      } else if (id > 0 && id < 6) {
        wx.request({
          url: `${base}?json={"cmd":"myorderlist","uid":"${uid}","state":"${state}","nowPage":"1","pageCount":"10"}`,
          success: function(res) {
            var data = res.data.dataList
            console.log(res,data)
            if (data) {
              var arr = []
              for (let i = 0; i < data.length; i++) {
                if (data[i].state != 9) {
                  arr.push(data[i])
                }
              }
              // //console.log(arr)
              data = arr
              for (let i = 0; i < data.length; i++) {
                if (data[i].state == 0) {
                  data[i].state = '待付款'
                }
                if (data[i].state == 1) {
                  data[i].state = '待评估'

                }
                if (data[i].state == 2) {
                  data[i].state = '待补差'

                }
                if (data[i].state == 3) {
                  data[i].state = '待邮寄'


                }
                if (data[i].state == 4) {
                  data[i].state = '已邮寄'

                }
                if (data[i].state == 5) {
                  data[i].state = '待清洗'

                }
                if (data[i].state == 6) {
                  data[i].state = '待收货'
                }
                if (data[i].state == 7) {
                  data[i].state = '待评价'
                }
                if (data[i].state == 8) {
                  data[i].state = '已评价'
                }
                if (data[i].state == 9) {
                  data[i].state = '已取消'
                }
              }
              that.setData({
                list: data
              })
            } else {
              that.setData({
                list: ''
              })
            }
            wx.hideLoading()
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // //console.log(options.id) id等于index
    var id = options.id
    this.setData({
      active: id
    })
    this.getList()
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
    // wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})