// pages/fast/fast.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {
      src: '../../images/quxiao@3x.png'
    },
    list: [],
    types: [],
    // activeId: 0,
    active: 0,
    // num:1,
    total: 30,
    id: '',
    listIndex: 0,
    price: '',
    arr: [],
    selectedArr: []
  },
  upload(event) {
    var index = event.currentTarget.dataset.index //绑定索引，确定是哪个单上传图片
    // //console.log(index)
    wx.navigateTo({
      url: '../ud/ud?index=' + index,
    })
  },
  clickFormView(event) { //模板消息的模板
    let formid = event.detail.formId;
    if (formid && formid !== 'the formId is a mock one') {
      app.formid(formid)
    }
  },

  //提交订单，有图提交，无图提示
  submit() {
    var base = app.globalData.base
    var that = this
    var id = this.data.id

    app.getAuthKey().then(function(res) {
      var list = []
      var arr = []
      for (var i = 0; i < app.globalData.allList.length; i++) {
        // for(let j=0;j<)
        list.push(app.globalData.allList[i][1])
      }
      // //console.log(app.globalData.allList)
      // //console.log(list)

      for (let i = 0; i < list.length; i++) {
        var obj = {}
        // //console.log(list[i])
        for (let j in list[i]) {
          // //console.log(j,list[i][j])
          if (list[i][j] != '') {
            obj[j] = list[i][j]
          }
        }
        arr.push(obj)
      }
      that.setData({
        selectedArr: arr
      })
      //console.log(arr)
      var goodslist = JSON.stringify(arr)
      // //console.log(goodslist)
      var uid = res.data
      // //console.log(url)
      wx.request({
        url: `${base}?json={"cmd":"fastaddgoodscar","uid":"${uid}","goodslist":${goodslist}}`,
        success: function(res) {
          //console.log(res.data, '快速下成功返回数据') //购物车id数组
          wx.showToast({
            title: res.data.resultNote,
            icon: 'success',
            duration: 2000
          })
          // that.setData({
          //   goodscaridlist:res.data.goodscaridlist
          // })
          var goodscaridlist = res.data.goodscaridlist
          var selectedArr = that.data.selectedArr //处理成订单信息数据
          for (var i = 0; i < selectedArr.length; i++) {
            selectedArr[i].goodsprice = that.data.price
            selectedArr[i].value = 1
            selectedArr[i].goodscarid = goodscaridlist[i]
            if (selectedArr[i].type1 == "26d24e99b09e408bb4a47ae0116cabb1") {
              selectedArr[i].type1 = "球鞋"
            } else if (selectedArr[i].type1 == "fb2157f71a6d43ad899e57d0bc8bbd60") {
              selectedArr[i].type1 = "靴子"
            }
            selectedArr[i].goodsname = selectedArr[i].type1 + '清洗'

            for (var j in selectedArr[i]) {
              if (j.indexOf('image') > -1) {
                selectedArr[i].goodsimage = app.globalData.avatarUrl + selectedArr[i][j]
              }
            }

          }
          //console.log(selectedArr)
          // selectedArr = JSON.stringify(selectedArr)
          wx.setStorageSync("selectedArr", selectedArr)
          if (res.data.result == 0) {
            wx.navigateTo({
              url: '../orderinfo/orderinfo?type=1' //成功之后跳转订单信息
            })
          }

          // that.setData({
          //   // list:res.data.dataList
          // })
        }
      })

    })

  },
  obj(cate) {
    return {
      goodsid: 1,
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      image6: "",
      type1: cate
    }
  },
  add() {
    var arr = app.globalData.allList;
    let gd1 = arr[0][0];
    let gd2 = arr[0][2];
    let imgBox = this.obj(arr[0][0]['typeid']);
    let arrBox = [gd1, imgBox, gd2];
    app.globalData.allList.push(arrBox);
    // var activeId = arr[0].activeId
    // var obj = {
    //   activeId: activeId
    // };
    // //console.log(this.data.types, "111111")
    //   arr.image1 = ''
    // arr.image2 = ''
    //   arr.image3 = ''
    //   arr.image4 = ''
    //   arr.image5 = ''
    // arr.image6 = ''
    // arr.push(this.data.types)

    this.setData({
      list: app.globalData.allList,
      length: app.globalData.allList.length
    })
    //console.log(this.data.length)
    this.total()


    // app.globalData.allList = arr
    //console.log(app.globalData.allList)
  },
  // menuClick: function (e) {
  //   //console.log(e)
  //   var index = e.target.dataset.id
  //   var list = []

  //   for(let i=0;i<this.data.list.length;i++){
  //     list.push(this.data.list[i])
  //   }
  //   list[index].num = e.target.dataset.num
  //   this.setData({
  //     // num: e.target.dataset.num,
  //     // id:e.target.dataset.id
  //     list:list
  //   })
  //   //console.log(this.data.list)

  // },
  onChange(event) { //选择分类的时候
    var i = event.detail
    var index = event.currentTarget.dataset.index
    // //console.log(i)
    // var obj = this.data.list

    // if (i == 0) {
    //   for (var j = 0; j < obj[index].length; j++) {
    //     if (obj[index][j]['active'] == i) {
    //       obj[index][j]['typeid'] = obj[index][0]['typeid']
    //     }
    //   }
    // } else if (i == 1) {
    //   for (var j = 0; j < obj[index].length; j++) {
    //     if (obj[index][j]['active'] == i) {
    //       obj[index][j]['typeid'] = obj[index][1]['typeid']
    //     }
    //   }
    // }
    if (i == 0) {
      app.globalData.allList[index][1]['type1'] = app.globalData.allList[index][0]['typeid']
    }

    if (i == 2) {
      app.globalData.allList[index][1]['type1'] = app.globalData.allList[index][2]['typeid']
    }



    this.setData({
      list: app.globalData.allList
    })
    // //console.log(app.globalData.allList)

    // //console.log(this.data.type[index].typeid)
    // var list = this.data.list
    // //console.log(list)
    // list[index].activeId = this.data.type[i].typeid
    // list[index].activeId = this.data.type[index].typeid
    // this.setData({
    //   list: list
    // })
    // //console.log(this.data.list)
  },
  del(e) {
    // //console.log(e)
    var id = e.currentTarget.dataset.id
    var arr = this.data.list
    arr.splice(id, 1)
    var num = this.data.list.length
    var price = 30
    var total = num * price
    var brr = this.data.arr
    brr.splice(id, 1)
    this.setData({
      list: arr,
      total: total,
      length: app.globalData.allList.length,
      arr: brr
    })
    this.total()
  },
  total() {
    var num = this.data.length
    var price = this.data.price
    var total = num * price
    this.setData({
      total: total
    })
    // return total
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getStorage({
      key: 'imageUrl',
      success(res) {
        // //console.log(JSON.parse(res.data))
        var arr = JSON.parse(res.data)
        var baseUrl = app.globalData.avatarUrl
        if (arr.length < 3) {
          wx.showToast({
            title: '请上传至少三张图片',
            duration: 2000
          })
          return
        } else if (arr.length >= 3) {
          var preview = ''
          for (let i = 0; i < arr.length; i++) {
            // var url = `${base}?json={"cmd":"addgoodscar","goodsid":"${goodsid}","uid":"${uid}","type1":"${activeId}",}`
            if (arr[i] != '') {
              // image += `"image${i + 1}":"${arr[i]}",`
              preview = baseUrl + arr[i]
              break
            }

          }
        }
        // //console.log('arr', preview)
      }
    })
    var base = app.globalData.base
    var that = this
    wx.request({
      url: `${base}?json={"cmd":"getgoodsprice","goodsid":"1"}`,
      success: res => {
        // //console.log(res)

        if (res.data.result == 0) {
          that.setData({
            price: parseInt(res.data.dataobject)
          })
        }
      }


    })
    wx.request({
      url: `${base}?json={"cmd":"goodstypelist","goodsid":"1"}`,
      success: res => {
        var type = []
        for (var i = 0; i < res.data.typeList1.length; i++) {
          if (res.data.typeList1[i].typename == '球鞋') {
            type.push({
              typeid: res.data.typeList1[i].typeid,
              typename: res.data.typeList1[i].typename,
              active: 0
            })
            type.push({
              goodsid: 1,
              type1: res.data.typeList1[i].typeid,
              image1: '',
              image2: '',
              image3: '',
              image4: '',
              image5: '',
              image6: '',
            })
          }
          if (res.data.typeList1[i].typename == '靴子') {
            type.push({
              typeid: res.data.typeList1[i].typeid,
              typename: res.data.typeList1[i].typename,
              active: 1
            })
          }
        }
        var all = []
        all.push(type)
        // //console.log(type, '99999')

        that.setData({
          types: type,
          list: all
        })

        app.globalData.allList = all

        // //console.log(app.globalData.allList,"alllist")
        that.setData({
          length: app.globalData.allList.length
        })
      }
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
    // //console.log(this.data.list) 上传完照片有值 数组套数组套对象
    var list = []
    var arr = []
    for (var i = 0; i < this.data.list.length; i++) {
      // for(let j=0;j<)
      list.push(this.data.list[i][1])
    }
    // //console.log(app.globalData.allList)
    // //console.log(list)

    for (let i = 0; i < list.length; i++) {
      var obj = {}
      // //console.log(list[i])
      for (let j in list[i]) {
        // //console.log(j, list[i][j])
        if (list[i][j] != '') {
          obj[j] = list[i][j]
        }
      }
      arr.push(obj)
    }


    // //console.log(arr[0][2])
    // //console.log(arr)
    var crr = []
    for (var i = 0; i < arr.length; i++) {
      var brr = []
      for (var j in arr[i]) {
        if (j.indexOf('image') > -1) {
          // //console.log(j)
          brr.push(app.globalData.avatarUrl + arr[i][j])
        }

      }
      crr.push(brr)
    }
    // //console.log(crr)
    this.setData({
      arr: crr
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