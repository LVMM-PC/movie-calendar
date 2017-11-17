//app.js
App({
  //全局数据，中文日期，供转换用
  chineseDate: {
    years: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
  },
  calendarData:{
    '2017-11-16': {
      "chineseDate": '九月廿七',
      "title": '试图刺杀希特勒的克劳斯·冯·施道芬堡',
      "time": '（1907.11.15-1944.7.20）',
      "comment": '现在我知道还可以做些什么来效忠德国，如果只顾自己，我就是叛国者',
      "from": '',
      "movie": '行动目标希特勒',
      "average": '7.0',
      "stars": 3.5
    }
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    // 使用设备可视宽高
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.windowHeight = res.windowHeight;
      }
    });
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    windowWidth: 0,
    windowHeight: 0,
    doubanBase: "https://api.douban.com",
    inTheaters: "/v2/movie/in_theaters",
    comingSoon: "/v2/movie/coming_soon",
    top250: "/v2/movie/top250",
    weekly: "/v2/movie/weekly",
    usBox: "/v2/movie/us_box",
    newMovies: "/v2/movie/new_movies",
    subject: "/v2/movie/subject/",
    celebrity: "/v2/movie/celebrity/",
    search: "/v2/movie/search?q="
  }
})