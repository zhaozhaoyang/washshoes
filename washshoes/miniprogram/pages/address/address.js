// pages/address/address.js
import Dialog from '../../dist/dialog/dialog';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    checked: false,
    list: [],
    list1: [],
    radio: ''
  },
  onClose() {
    this.setData({
      show: false
    });
  },

  // goBack() {
  //   wx.navigateBack({
  //     delta: 3
  //   })
  // },
  more() {

    this.setData({
      list1: this.data.list
    })
  },
  selected(e) {
    // //console.log(e)
    var index = e.currentTarget.dataset.index
    app.globalData.address = this.data.list1[index]
    // //console.log(app.globalData.address)
    wx.navigateBack({
      delta: 1
    })
  },
  onDel(e) {
    // //console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    var that = this
    var base = app.globalData.base
    this.setData({
      show: true
    })
    Dialog.confirm({
      message: '确认删除？'
    }).then(() => {
      // on confirm
      this.setData({
        show: false
      })
      app.getAuthKey().then(function(res) {
        var uid = res.data
        wx.request({
          url: `${base}?json={"cmd":"deleteAddress","uid":"${uid}","addressid":"${id}"}`,
          success: function(res) {
            var data = res.data
            //console.log(data)

            // that.setData({
            //   list:data
            // })
            that.onShow()
          }
        })
      }).catch(() => {
        // on cancel
        this.setData({
          show: false
        });
      });

    }).catch(() => {
      this.setData({
        show: false
      })
    })

  },
  add() {
    wx.navigateTo({
      url: '../add/add',
    })
  },
  onChange(event) {
    // //console.log(event)

    this.setData({
      radio: event.detail
    });

  },
  onClick(e) {
    // //console.log(e)
    var index = e.currentTarget.dataset.index
    // //console.log(index)
    var list = this.data.list1
    // //console.log(list[index])
    var obj = list[index]
    // var obj = e.currentTarget.dataset;
    var base = app.globalData.base
    var that = this
    var url = ''
    var id = obj.addressid
    obj.isdefault = 1
    for (var i = 0; i < list.length; i++) {
      if (i == index) {
        list[i].isdefault = 1
      } else {
        list[i].isdefault = 0
      }
    }
    that.setData({
      list1: list
    })
    // //console.log(obj.isdefault)
    app.getAuthKey().then(function(res) {
      var uid = res.data

      url = `${base}?json={"cmd":"addAddress","uid":"${uid}","name":"${obj.name}","phone":"${obj.phone}","address":"${obj.address}","addressdetail":"${obj.addressdetail}","isdefault":"${obj.isdefault}","addressid":"${id}"}`

      // //console.log(url)
      wx.request({
        url: url,
        success(res) {
          //console.log(res)

          // wx.navigateTo({
          //   url: '../address/address'
          // })

        }
      })


    })
    // wx.setStorage({
    //   key: 'defaultAddr',
    //   data: list[index],
    // })
  },
  onEdit(e) {
    // //console.log(e)
    var obj = e.currentTarget.dataset;
    // var address=obj.address
    wx.navigateTo({
      url: `../add/add?address=${obj.address}&addressdetail=${obj.addressdetail}&id=${obj.id}&name=${obj.name}&phone=${obj.phone}&isdefault=${obj.isdefault}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    var base = app.globalData.base
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"myAddressList","uid":"${uid}"}`,
        success: function(res) {
          wx.hideLoading()

          var data = res.data.dataList
          // //console.log(data)
          if (data) {
            var data1 = data.slice(0, 3)
            that.setData({
              list: data,
              list1: data1
            })
            for (var i = 0; i < data.length; i++) {
              if (data[i].isdefault == 1) {
                that.setData({
                  radio: data[i].addressid
                })
                wx.setStorage({
                  key: 'defaultAddr',
                  data: data[i],
                })
                // //console.log(data[i])

              }
            }
          } else {
            that.setData({
              list: '',
              list1: ''
            })
            wx.removeStorageSync('defaultAddr')
          }
          // //console.log(data)

          // for(let i=0;i<data.length;i++){
          //   if(data[i].isdefault==1){
          //     app.globalData.defaultAddr = data[i] 
          //   }
          // }

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
  onLoad: function() {

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