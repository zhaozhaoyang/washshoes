// pages/upload/upload.js
let app = getApp();
let gd = app.globalData;
// var arr = ['../../images/ding@2x.png',
//   '../../images/fanmian@2x.png',
//   '../../images/fan@2x.png',
//   '../../images/hou@2x.png',
//   '../../images/di@2x.png',
//   '../../images/ding@2x.png'
// ];

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
    num: 0,
    list: ['','','','','',''],
    show: false
  },
  del(e) {
    // console.log(e)
  
    // console.log(gd,"2222222")
    var that = this
    var index = e.target.dataset.index
    var count = this.data.num
    var arr = this.data.arr
    var brr = this.data.arr1
    gd.allList[count][1]['image' + (index + 1)] = '';
    arr[index][0] = brr[index][0]
    arr[index][1] = brr[index][1]
    arr[index][2] = false
    // console.log(arr,'5555555555555')
    this.setData({
      arr1: arr
    })
    // console.log(app.globalData.allList,'删除了吗')
  },
  upload(e) {
    var count = this.data.num
    // var list = this.data.list
    // console.log(this.data.list,'赋值')
    // console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    var base = app.globalData.base
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album','camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0];
        that.getpath(id, tempFilePaths) //调用接口函数
      }
    })
  },
  save() {
    // var arr = this.data.list;
    // var arr1 = this.data.arr1
    // var count = this.data.num
    // arr = JSON.stringify(arr)
    // arr1 = JSON.stringify(arr1)
    // wx.showToast({
    //   title: '上传成功',
    //   icon: 'success',
    //   duration: 2000
    // })
    var i = this.data.num
    // console.log(app.globalData.allList[i][1])
    var arr=[]
    var obj=app.globalData.allList[i][1];
    for(var i in obj){
      if(i.indexOf('image')>-1 && obj[i]!=""){
        // console.log(i,obj[i])
        arr.push(obj[i])
      }
    }
    // console.log(arr)
    if(arr.length<3){
      wx.showToast({
        title:'至少上传三张图片',
        icon: 'none'
      })
    }else if(arr.length>=3){
      wx.navigateBack({
        delta:1
      })
    }
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
        var list = that.data.list
        var arr1 = that.data.arr1
        var count = that.data.num
        app.globalData.allList[count][1]['image' + (id+1)] = data.dataobject
        list[id] = data.dataobject;
        arr1[id][0] = data.dataobject;
        arr1[id][2] = true
        arr1[id][1] = ''
        that.setData({
          arr1: arr1, //网络图片
          list: list, //相对地址
        })
      }
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options.index)
    this.setData({
      num: options.index
    })
    var count = this.data.num
    var obj = this.data.arr1
    var arr = []
    console.log(app.globalData.allList)
    if (app.globalData.allList[count][1]['image1']) {
      arr.push([app.globalData.allList[count][1]['image1']])
    } else {
      arr.push(obj[0])
    }
    if (app.globalData.allList[count][1]['image2']) {
      arr.push([app.globalData.allList[count][1]['image2']])
    } else {
      arr.push(obj[1])
    }
    if (app.globalData.allList[count][1]['image3']) {
      arr.push([app.globalData.allList[count][1]['image3']])
    } else {
      arr.push(obj[2])
    }
    if (app.globalData.allList[count][1]['image4']) {
      arr.push([app.globalData.allList[count][1]['image4']])
    } else {
      arr.push(obj[3])
    }
    if (app.globalData.allList[count][1]['image5']) {
      arr.push([app.globalData.allList[count][1]['image5']])
    } else {
      arr.push(obj[4])
    }
    if (app.globalData.allList[count][1]['image6']) {
      arr.push([app.globalData.allList[count][1]['image6']])
    } else {
      arr.push(obj[5])
    }
    this.setData({
      arr1: arr
    })
    // console.log(arr,'开始')
    // console.log(app.globalData.allList,'初始化')
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