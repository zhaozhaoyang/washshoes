// pages/comment/comment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageURL: '../../images/tu2x.png',
    list: '',
    comment: '',
    id: '',
    arr: [],
    commentimages: []
  },
  bindTextAreaBlur(e) {
    // //console.log(e.detail.value)
    this.setData({
      comment: e.detail.value
    })
  },
  comment() { //调用评论接口

    var that = this
    app.getAuthKey().then(function(res) {
      var uid = res.data
      var ordernum = that.data.id
      var base = app.globalData.base
      var comment = that.data.comment
      if (comment == '') {
        wx.showToast({
          title: '评价不能为空',
          icon: 'none'
        })
        return
      }
      wx.showLoading({
        title: '评价中…',
      })
      var commentimages = that.data.commentimages
      commentimages = JSON.stringify(commentimages)
      // //console.log(commentimages)
      var orderdetailid = that.data.list.orderdetail[0].orderdetailid
      var url = `${base}?json={"cmd":"commentorder","uid":"${uid}","ordernum":"${ordernum}","commentlist":[{"orderdetailid": "${orderdetailid}","comment": "${comment}","commentimages": ${commentimages}}]}`

      // //console.log(url,that.data.commentimages)
      wx.request({
        url: url,
        success(res) {
          //console.log(res)
          if (res.data.result == 0) {
            wx.showToast({
              title: '评价成功',
            })
            wx.switchTab({
              url: '../person/person'
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
    wx.showLoading({
      title: '加载中…',
    })
    var that = this
    var id = options.id
    that.setData({
      id: id
    })
    var base = app.globalData.base
    //console.log(options)
    var id = options.id
    var that = this
    app.getAuthKey().then(function(res) {
      var uid = res.data
      wx.request({
        url: `${base}?json={"cmd":"myorderDetail","uid":"${uid}","ordernum":"${id}"}`,
        success: function(res) {
          var data = res.data.dataobject
          //console.log(data)
          if (data.paytype == 0) {
            data.paytype = "余额支付"
          } else if (data.paytype == 1) {
            data.paytype = "微信支付"
          }
          if (data.type == 0) {
            data.type = "线上邮寄"
          } else if (data.type == 1) {
            data.type = "自行送取"
          }
          that.setData({
            list: data,
            // orderdetailid:data.
          })
          wx.hideLoading()
        }
      })

    })
  },
  upload(e) {

    // //console.log(e.currentTarget.dataset.id)
    // var id = e.currentTarget.dataset.id
    var base = app.globalData.base
    var that = this
    var commentimages = this.data.commentimages
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        //console.log(res)
        var tempFilePaths = res.tempFilePaths; //上传图片数组
        //调用接口函数
        if (commentimages.length < 3) {
          // commentimages.push(data.dataobject)
          that.getpath(tempFilePaths[0])
        } else {
          wx.showToast({
            title: '最多上传三张图片',
            icon: 'none'
          })
        }

      }
    })
  },
  getpath: function(url) { //获取图片路径
    var that = this;
    var list = []
    wx.uploadFile({
      url: app.globalData.baseUrl,
      filePath: url,
      name: 'file',
      formData: {},
      success(res) {
        const data = JSON.parse(res.data);
        //console.log(data)
        var arr = that.data.arr
        var commentimages = that.data.commentimages
        arr.push(app.globalData.avatarUrl + data.dataobject)
        // if(commentimages.length<3){
        commentimages.push(data.dataobject)
        // }else{
        //   wx.showToast({
        //     title: '最多上传三张图片',
        //     icon:'none'
        //   })
        // }
        that.setData({
          arr: arr,
          commentimages: commentimages
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