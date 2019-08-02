//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    adt:{},
    mm:{},
    code:0,
    navbarH:0,
  },

  onLoad: function () {
    
    wx.getUserInfo({
      success: res => {
        // console.log(res)
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })                 
      }
    });
    wx.loadFontFace({
      family: 'myff',
      source: 'url("https://sungd.github.io/Pacifico.ttf")',
      success: res => {
        // console.log(res)
      }
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       console.log(res)
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  
  onReady(){
    let n = 0;
    let tm = setInterval(()=>{
      if(n>=3){
        clearInterval(tm)
      }
      n ++;
      this.setData({
        code:n,
      })
      let animation = wx.createAnimation({
        duration: 1800,
        timingFunction: 'ease'
      });
      animation.opacity(1).step();
      setTimeout(()=>{
        this.setData({
          adt: animation.export(),
        })
      },1)
    },1600);
  },
  onShow(){
    
    let menuBtn = wx.getMenuButtonBoundingClientRect();
    console.log(menuBtn)
    this.setData({
      navbarH: menuBtn.bottom + 8,
    })
  },
  aa(){
    let am = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out',
    });
    am.opacity(1).scale(1, 1).translate(40, 0).step();
    this.setData({
      mm: am,
    })
  },
  go(){
    wx.navigateTo({
      url: '../home/home',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})
