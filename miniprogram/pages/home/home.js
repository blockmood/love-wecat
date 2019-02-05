// miniprogram/pages/home/home.js
var page = undefined;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:null,
    doommData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindbt: function () {
    doommList.push(getList());
    this.setData({
      doommData: doommList
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //初始化时间戳
    let oldData = +new Date('2018/02/14')
    //现在的时间戳
    let newData = +new Date()
    let difference = newData - oldData
    //计算当前时间
    let differenceTime = parseInt(difference / (1000 * 60 * 60 * 24))
    this.setData({
      time: differenceTime
    })
    //自动出弹幕
    // setInterval(()=>{
    //   doommList.push(getList());
    //   this.setData({
    //     doommData: doommList
    //   })
    // },800)
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

//弹幕文字
var arr = ['老婆，我爱你','亲爱的，祝你开心呀！','宝贝儿！','嘻嘻嘻~','我错了~~','就快一年啦，宝宝！','新年快乐呀!','我的天呐！','要开心呀！']

//弹幕列表
function getList(){
  //随机数
  let num = Math.floor(Math.random() * arr.length)
  return new Doomm(arr[num], Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 10), getRandomColor())
}

var doommList = [];
var i = 0;
class Doomm {
  constructor(text, top, time, color) {
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    let that = this;
    this.id = i++;
    setTimeout(function () {
      doommList.splice(doommList.indexOf(that), 1);
      page.setData({
        doommData: doommList
      })
    }, this.time * 1000)
  }
}
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}