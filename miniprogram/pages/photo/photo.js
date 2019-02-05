// miniprogram/pages/photo/photo.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    auth:false,
    list:{
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
      var self = this
      wx.getStorage({
        key: 'auth',
        success: function(res) {
          self.setData({
            auth: true
          })
        },
        fail:()=>{
          wx.setStorage({
            key: 'auth',
            data: '',
          })
        }
      })
  },

  //去授权
  onGotUserInfo:function(res){
    if (res.detail.userInfo.nickName){
      wx.setStorage({
        key: 'auth',
        data: 'true',
      })
      this.setData({
        auth:true
      })
    }
  },

  //图片上传
  doUpload:function(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            const db = wx.cloud.database()
            //保存路径到数据库
            db.collection('pic').add({
              data: {
                image_url: filePath,
                mouth: new Date().getMonth() + 1
              },
              success: res => {
                const data = that.data.list
                const day = new Date().getMonth() + 1
                for (var i in data){
                  if (day == i){
                    data[i].push({
                      image_url: filePath,
                      mouth: day
                    })
                  }
                }
                that.setData({
                  list:data
                })
                this.onReady()
                wx.showToast({
                  title: '上传成功',
                })
  
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '上传失败'
                })
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  //预览图片
  bigImg: function (event){
    //转换Img列表
    let arr = []
    const {list} = this.data
    for(var i in list){
      list[i].map(item => {
        arr.push(item.image_url)
      })
    }
    wx.previewImage({
      current: event.currentTarget.dataset.gid, // 当前显示图片的http链接
      urls: arr
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取图片列表
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('pic').orderBy('mouth', 'desc').get({
      success: res => {
        //转换数据结构
        const {list} = this.data
        for (let i in list) {
          res.data.map(item => {
            if (item.mouth == i) {
              list[i].push(item)
            }
          })
        }

        this.setData({
          list
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})