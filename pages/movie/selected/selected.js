// pages/movie/selected/selected.js
var app = getApp();
Page({
  data: {
    typeTitle: "",
    scrollFlag: true,
    currentNum:0,
    noMoreData: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var typeId = options.typeId;
    // 设置榜单标题
    var typeTitle = options.typeTitle;
    wx.setNavigationBarTitle({
      title: typeTitle
    });

    that.setData({
      "typeId": typeId,
      "windowWidth": app.globalData.windowWidth,
      "windowHeight": app.globalData.windowHeight
    });

    that.getMovieListData(typeId);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  /** 获取电影榜单数据 */
  getMovieListData: function (typeId) {
    var that = this;
    var offset = 0;
    var url = app.globalData.doubanBase;
    that.data.scrollFlag = false;
    if (typeId == "top250") {
      offset = that.data.offset || 0;
      url += app.globalData.top250 + "?start="+ that.data.currentNum +"&&count=5";
    } else if (typeId == "usBox") {
      url += app.globalData.usBox + "?start=" + that.data.currentNum +"&&count=5";
    } else {

    }

    that.setData({
      "offset": offset
    });
    var total = that.data.total || 999;
    // 最多加载50个电影数据
    console.log(111)
    if (that.data.movies && that.data.movies.length >= 50) {
      that.data.noMoreData = true;
      return;
    }
    console.log(222)
    if (that.data.movies && that.data.selectedType === 'usBox'){
      that.data.noMoreData = true;
      return;
    }

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });

    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'json' }, // 设置请求的 header
      success: function (res) {
        var subjects = res.data.subjects;

        var movies = that.data.movies || [];
        var offset = that.data.offset || 0;
        var total = res.data.total;
        offset += subjects.length;
        for (let idx in subjects) {
          var subject = subjects[idx];
          if(typeId === 'usBox'){
              subject = subjects[idx].subject;
          }
          var directors = "";
          for (let i in subject.directors) {
            directors += subject.directors[i].name;
          }
          var casts = "";
          var separate = " / ";
          for (let j in subject.casts) {
            casts += subject.casts[j].name + separate;
          }
          casts = casts.substring(0, casts.length - separate.length);

          var genres = "" ;
          for (let k in subject.genres) {
            genres += subject.genres[k] + separate;
          }
          genres = genres.substring(0, genres.length - separate.length);
          //计算星星数
          subject.rating.stars = that.starCount(subject.rating.stars);
          var temp = {
            id: subject.id,
            title: subject.title,
            rating: subject.rating,
            collectCount: subject.collect_count,
            images: subject.images,
            subtype: subject.subtype,
            directors: directors,
            casts: casts,
            typeId: typeId,
            year: subject.year,
            genres: genres
          };
          movies.push(temp);
        }
        var readyData = {
          selectedType: typeId,
          offset: offset,
          total: total,
          movies: movies
        };
        that.data.scrollFlag = true;
        //刷新that.data.currentNum
        that.data.currentNum += 5;
        that.setData(readyData);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.hideToast();
      }
    });
  },
  /** 页面滑动到底部 */
  handleLower: function (event) {
    console.log("handleLower");
    if (!this.data.scrollFlag){
      return
    }
    this.getMovieListData(this.data.typeId);
  },
  /** 页面滑动到顶部 */
  handleUpper: function (event) {
    console.log("handleUpper");
  },
  /** 跳转到电影详情页 */
  bindMovieDetail: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/movie/movie-detail/movie-detail?id=' + id
    });
  }, 
  //计算行星显示规则
  starCount: function (originStars) {
    //计算星星显示需要的数据，用数组stars存储五个值，分别对应每个位置的星星是全星、半星还是空星
    var starNum = originStars / 10, stars = [], i = 0;
    do {
      if (starNum >= 1) {
        stars[i] = 'full';
      } else if (starNum >= 0.5) {
        stars[i] = 'half';
      } else {
        stars[i] = 'no';
      }
      starNum--;
      i++;
    } while (i < 5)
    return stars;
  }
})