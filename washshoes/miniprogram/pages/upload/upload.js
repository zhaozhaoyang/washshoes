// pages/upload/upload.js
const app = getApp();
// var arr = ['../../images/ding@2x.png',
//   '../../images/fanmian@2x.png',
//   '../../images/fan@2x.png',
//   '../../images/hou@2x.png',
//   '../../images/di@2x.png',
//   '../../images/ding@2x.png'
// ];
var arr = [[], [], [], [], [], []]
var arrorg = ['../../images/ding@2x.png',
  '../../images/ding@2x.png',
  '../../images/ding@2x.png',
  '../../images/ding@2x.png',
  '../../images/ding@2x.png',
  '../../images/ding@2x.png'
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/ding@2x.jpg',
        '正面俯视'
      ],
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/fan@2x.jpg',
        '正面平铺'
      ],
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/fanmian@2x.jpg',
        '反面平铺'
      ],
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/hou@2x.jpg',
        '鞋后跟平视照'
      ],
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/di@2x.jpg',
        '鞋底'
      ],
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/xiu@2x.jpg',
        '瑕疵特写'
      ]
    ],
    arr1: [
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/ding@2x.jpg',
        '正面俯视'
      ],
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/fan@2x.jpg',
        '正面平铺'
      ],
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/fanmian@2x.jpg',
        '反面平铺'
      ],
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/hou@2x.jpg',
        '鞋后跟平视照'
      ],
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/di@2x.jpg',
        '鞋底'
      ],
      [
        'https://xcx.brush666.com/washshoes/userfiles/tu/xiu@2x.jpg',
        '瑕疵特写'
      ]
    ],
    list: ['', '', '', '', '', ''],
    show:false
  },
  del(e) {
    // //console.log(e)
    var that = this
    var index = e.target.dataset.index
    let arr = this.data.arr
    var list = that.data.list
    list[index]=""
    that.data.arr1[index][0] = arr[index][0]
    that.data.arr1[index][1]=arr[index][1]
    that.data.arr1[index][2]=false
    that.setData({
      arr1: that.data.arr1,
      list:list
    })
    //console.log(that.data.arr1)
  },
  upload(e) {

    // //console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    var base = app.globalData.base
    var that = this
    // wx.chooseImage({
    //   success(res) {
    //     const tempFilePaths = res.tempFilePaths
    //     wx.saveFile({
    //       tempFilePath: tempFilePaths[0],
    //       success(res) {
    //         const savedFilePath = res.savedFilePath
    //       }
    //     })
    //   }
    // })
    // var arr = ''
    // wx.removeStorage({
    //   key: 'imageUrl',

    // })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album','camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0];
        that.getpath(id, tempFilePaths)//调用接口函数
      }
    })
  },
  save() {
    var arr = app.globalData.list;
    //console.log(arr)
    var arr1 = this.data.arr1;
    // //console.log(arr, '-', arr1)
    var count = 0
    for(var i=0;i<arr.length;i++){
      if(arr[i]!=''){
        count++
      }
    }
    if(count<3){
      wx.showToast({
        title:'至少上传三张图片'
      })
    }else{
      arr = JSON.stringify(arr)
      arr1 = JSON.stringify(arr1)
      wx.setStorage({
        key: 'imageUrl',
        data: arr,
        success: function (res) {
           wx.navigateBack(); //返回上一个页面
        }
      })
      wx.setStorage({
        key: 'prview',
        data: arr1,
      })
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 2000
      })
    }
    // //console.log(count)
    
  },
  // 从后台获取路径的函数封装
  getpath: function(id, url) {
    var that = this;
    wx.uploadFile({
      url: app.globalData.baseUrl,
      filePath: url,
      name: 'file',
      formData: {},
      success(res) {
        const data = JSON.parse(res.data);
        // //console.log(data)
        // //console.log(arr)
        // if (id == 0) {
        var list = that.data.list
        var arr1 = that.data.arr1
        //console.log(that.data.arr1)
        list[id] = data.dataobject;
        arr1[id][0] = data.dataobject;
        arr1[id][2] = true
        arr1[id][1]=''
        that.setData({
          arr1: arr1,//网络图片
          list: list,//相对地址
          // show:true
        })
        app.globalData.preview = that.data.arr1
        app.globalData.list = that.data.list
      }
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {  
    if(app.globalData.preview.length>0){
      this.setData({
          arr1:app.globalData.preview
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