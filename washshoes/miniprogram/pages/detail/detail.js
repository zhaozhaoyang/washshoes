// pages/detail/detail.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
var uid = app.globalData.uid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [

    ],
    nodes: '',
    firstJump: undefined, //第一次跳转
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    show: false,
    list: [],
    obj: {},
    id: '',
    type: [],
    type2: [],
    type3: [],
    type4: [],
    type5: [],
    activeId: 0,
    active: 0,
    id2: 0,
    id3: 0,
    id4: 0,
    id5: 0,
    arr: [],
    uid: '',
    goodscarid: '',
    num: 0,
    nums: 0,
    changePrice: 0,
    changePrice1: 0,
    index1: 0
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onClickButton() {
    this.setData({
      show: true
    });
  },
  preview(e) {
    var i = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.list[0].images[i], // 当前显示图片的http链接
      urls: this.data.list[0].images // 需要预览的图片http链接列表
    })
  },
  goPay() {
    // //console.log(this.data.obj)
    wx.showLoading({
      title: '加载中…',
      mask: "true"
    })
    var that = this
    this.addCar().then(function(res) { //res.data 购物车id
      var goodscarid = res.data.goodscarid
      app.getAuthKey().then(function(res) {
        var uid = res.data
        wx.request({
          url: `https://xcx.brush666.com/washshoes/api/service?json={"cmd":"mygoodscar","uid":"${uid}"}`,
          success: function(res) {
            console.log(res.data)//购物车列表
            var cartItems = res.data.dataList
            wx.hideLoading()
            var arr = []
            if (cartItems) {
              for (let i = 0; i < cartItems.length; i++) {
                cartItems[i].value = 1
                cartItems[i].allPrice = parseInt(that.data.changePrice)
                if (cartItems[i].goodscarid == goodscarid) {
                  arr.push(cartItems[i])
                }
              }
            }
            if (arr) {
              that.setData({
                cartItems: arr
              })
              wx.setStorage({
                key: 'selectedArr',
                data: arr,
                success() {
                  wx.navigateTo({
                    url: '../orderinfo/orderinfo?id=' + goodscarid
                  })
                }
              })
              // var data = cartItems
            } else {
              that.setData({
                cartItems: ''
              })
              // reject('error')
            }
            // wx.hideLoading()
          }
        })
      })
    })
    var obj = {}
  },
  getList() {
    var that = this

    app.getAuthKey().then(function(res) {
      var uid = res.data
      // //console.log(uid)

      wx.request({
        url: `https://xcx.brush666.com/washshoes/api/service?json={"cmd":"mygoodscar","uid":"${uid}"}`,
        success: function(res) {
          // //console.log(res.data)
          var cartItems = res.data.dataList
          if (cartItems) {
            for (let i = 0; i < cartItems.length; i++) {
              cartItems[i].value = 1
            }
          }

          if (cartItems) {
            that.setData({
              cartItems: cartItems
            })
            wx.setStorage({
              key: 'selectedArr',
              data: cartItems,
            })
            var data = cartItems

          } else {
            that.setData({
              cartItems: ''
            })
            // reject('error')
          }
          // wx.hideLoading()

        }


      })


    })
  },
  goCart() {
    wx.switchTab({
      url: '../cart/cart'
    })
  },
  goIndex() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  goMore(e) {
    // //console.log(e)
    var id = this.data.id
    var cate = e.currentTarget.dataset.cate
    wx.navigateTo({
      url: '../goodscom/goodscom?id=' + id + '&cate=' + cate
    })
  },
  goCen() {
    wx.navigateTo({
      url: '../center/center'
    })
  },
  upload() {
    wx.navigateTo({
      url: '../upload/upload'
    })
  },
  onChange(event) {
    // //console.log(event.detail);
    var index = event.detail
    // //console.log(this.data.type[index].typeid)
    var activeId = this.data.type[index].typeid
    var price = this.data.type[index].typeprice
    this.setData({
      activeId: activeId,
      changePrice: price,
    })
    app.globalData.allPrice = price
  },
  onChange2(event) {
    let that = this
    console.log(event.detail)
    var index = event.detail
    var id2 = that.data.type2[index].typeid
    var price = that.data.type2[index].typeprice
    var price1 = that.data.type2[index].typeprice
    if(that.data.index1 == 1){
      price1 = that.data.type2[index].typeprice * 2
    } else if (that.data.index1 == 2){
      price1 = that.data.type2[index].typeprice * 3
    }
    that.setData({
      id2: id2,
      changePrice: price1,
      changePrice1: price,
      active: 0
    })
    app.globalData.allPrice = price1
  },
  onChange3(event) {
    let that = this
    // //console.log(event.detail);
    var index = event.detail
    // //console.log(this.data.type3[index].typeid)
    var id3 = that.data.type3[index].typeid
    var price = that.data.changePrice1 * (index+1)
    that.setData({
      id3: id3,
      changePrice: price,
      index1: event.detail
    })
    app.globalData.allPrice = price
  },
  onChange4(event) {
    let that = this
    console.log(event.target.dataset.id);
    var index = event.target.dataset.id
    // //console.log(this.data.type4[index].typeid)
    var id4 = that.data.type4[index].typeid
    that.setData({
      id4: id4,
      nums: index
    })
  },
  onChange5(event) { //选择定制图片
    let that = this
    console.log(event.currentTarget.dataset.ids);
    console.log(this.data.type5)
    var index = event.currentTarget.dataset.ids
    var price = that.data.type5[index].typeprice
    // //console.log(this.data.type5[index].typeid)
    var id5 = that.data.type5[index].typeid
    that.setData({
      id5: id5,
      num: index,
      changePrice: price,
    })
    app.globalData.allPrice = price
  },
  addCart() {
    this.setData({
      firstJump: false
    })
    this.addCar().then(function(res) {
      //console.log(res)
      if (res.data.result == 0) {
        wx.showToast({
          title: '加入成功',
        })
        app.globalData.preview = []
        wx.removeStorage({
          key: 'imageUrl',
        })
      }
    })
  },
  // 加入购物车
  addCar(e) {
    var that = this
    return new Promise(function(resolve, reject) {
      if (app.globalData.uid) {
        var id = that.data.id
        // //console.log(id)
        var base = app.globalData.base
        var goodsid = that.data.id
        var activeId = that.data.activeId
        var id2 = that.data.id2
        var id3 = that.data.id3
        var id4 = that.data.id4
        var id5 = that.data.id5
        var url = ''
        if (id == 3) {
          app.getAuthKey().then(function(res) {
            var uid = res.data
            url = `${base}?json={"cmd":"addgoodscar","goodsid":"${goodsid}","uid":"${uid}","type4":"${id4}","type5":"${id5}"}`
            //console.log(url)
            wx.request({
              url: url,
              success: data => {
                // //console.log(res) //加购物车成功,获取购物车id                
                that.setData({
                  goodscarid: data.data,
                  firstJump: false
                })
                var res = data
                resolve(res)
                var note = data.data.resultNote
                that.setData({
                  show: false
                });
                that.setData({
                  arr: []
                })
              }
            })
          })
        } else {
          wx.getStorage({
            key: 'imageUrl',
            success(res) {
              //console.log(JSON.parse(res.data))
              var arr = JSON.parse(res.data)
              that.setData({
                arr: arr
              })
              if (arr.length < 3) {
                wx.showToast({
                  title: '请上传至少三张图片',
                  duration: 2000
                })
                return
              } else if (arr.length >= 3) {
                var image = ''
                for (let i = 0; i < arr.length; i++) {
                  if (arr[i] != '') {
                    image += `"image${i + 1}":"${arr[i]}",`
                  }

                }
                // //console.log(image)
                image = image.substr(0, image.length - 1)
                app.getAuthKey().then(function(res) {
                  var uid = res.data
                  that.setData({
                    uid: res.data
                  })
                  // //console.log(url)
                  if (id == 1) {
                    url = `${base}?json={"cmd":"addgoodscar","goodsid":"${goodsid}","uid":"${uid}","type1":"${activeId}",${image}}`
                  } else if (id == 2) {
                    url = `${base}?json={"cmd":"addgoodscar","goodsid":"${goodsid}","uid":"${uid}","type2":"${id2}","type3":"${id3}",${image}}`
                  }
                  console.log(url)
                  wx.request({
                    url: url,
                    success: data => {
                      // //console.log(res) //加购物车成功,获取购物车id
                      that.setData({
                        goodscarid: data.data
                      })
                      var res = data
                      resolve(res)
                      var note = data.data.resultNote
                      // //console.log(data.data)
                      // that.setData({
                      //   list:res.data.dataList,
                      //   obj:res.data.dataobject
                      // })
                      that.setData({
                        show: false
                      });
                      wx.removeStorage({
                        key: 'imageUrl',

                      })
                      app.globalData.preview = []
                      that.setData({
                        arr: []
                      })
                      // wx.showToast({
                      //   title: note,
                      //   duration: 1000
                      // })
                    }
                  })
                })

              }

            },
            fail() {
              // //console.log('fail')
              wx.showToast({
                title: '至少上传三张图片',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },
  select(e) { //选择分类 
    // //console.log(e)
    var id = this.data.id
    var base = app.globalData.base
    var that = this
    this.setData({
      show: true
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中…',
    })
    var that = this
    var base = app.globalData.base
    // //console.log(options)
    var id = options.id
    this.setData({
      id: id
    })
    // //console.log(typeof(id))
    wx.request({
      url: `${base}?json={"cmd":"goodsdetail","goodsid":${id}}`,
      success: res => {
        wx.hideLoading()
        // //console.log(res)
        if (res.data.dataList) {
          that.setData({
            list: res.data.dataList,
            // obj: res.data.dataobject
          })
        } else {
          that.setData({
            list: ''
          })
        }
        if (res.data.dataobject) {
          that.setData({
            // list: res.data.dataList,
            obj: res.data.dataobject,
            nodes: res.data.dataobject.goodsdetail
          })
          console.log(res.data)
          // wx.wx.setStorageSync('nodes', that.data.nodes);
          var temp = WxParse.wxParse('nodes', 'html', that.data.nodes, that);
        } else {
          that.setData({
            // list: res.data.dataList,
            obj: ''
          })
        }
      }
    })

    if (id == 1) {
      wx.request({
        url: `${base}?json={"cmd":"goodstypelist","goodsid":"${id}"}`,
        success: res => {
          console.log(res)
          that.setData({
            type: res.data.typeList1,
            activeId: res.data.typeList1[0].typeid,
            changePrice: res.data.typeList1[0].typeprice,
          })
          app.globalData.allPrice = res.data.typeList1[0].typeprice
        }
      })
    } else if (id == 2) {
      wx.request({
        url: `${base}?json={"cmd":"goodstypelist","goodsid":"${id}"}`,
        success: res => {
          console.log(res.data)
          that.setData({
            type2: res.data.typeList2,
            type3: res.data.typeList3,
            id2: res.data.typeList2[0].typeid,
            id3: res.data.typeList3[0].typeid,
            changePrice: res.data.typeList2[0].typeprice,
            changePrice1: res.data.typeList2[0].typeprice,
          })
          app.globalData.allPrice = res.data.typeList2[0].typeprice
        }
      })
    } else {
      wx.request({
        url: `${base}?json={"cmd":"goodstypelist","goodsid":"${id}"}`,
        success: res => {
          console.log(res.data)
          that.setData({
            type4: res.data.typeList4,
            type5: res.data.typeList5,
            id4: res.data.typeList4[0].typeid,
            id5: res.data.typeList5[0].typeid,
            changePrice: res.data.typeList5[0].typeprice,
          })
          app.globalData.allPrice = res.data.typeList5[0].typeprice
        }
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
    this.setData({
      firstJump: true
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
    app.globalData.preview = []
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