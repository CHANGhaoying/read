//index.js
//获取应用实例
// const app = getApp()
let { bottom } = getApp().globalData.menuBtn;//胶囊按钮的底部
Page({
  data: {
    helloStr: '',// 早上/上午...
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // adt:{},
    // mm:{},
    // code:0,
    navbarH: bottom + 8,
    playflag:true,
    ratio:0.5,//rpx与px的转换比例
    sliderW: '22rpx',//进度条动态长度（初始值22rpx）
    sliderW_record:0,//每次操作结束后的进度条长度记录
    startX: NaN,//进度条圆点的初始按压位置
    sliderMaxWidth:0,//进度条总长
    coverFlag: true,//遮罩显示隐藏
    translate: true,//译文隐藏
  },
  toMine(){//去我的个人中心
    wx.navigateTo({
      url: '../mine/mine',
    })
  },
  play(e){
    // console.log(e)
    this.setData({
      playflag: !this.data.playflag,
    })
  },
  tap(e){
    console.log(e)
  },
  //拖动开始
  start(e){
    this.setData({
      startX: e.touches[0].clientX,
    })
    console.log(this.data.startX)
  },
  //拖动中
  move(e){
    let { startX, sliderW_record, sliderMaxWidth,ratio } = this.data;
    if (!startX) return;//如果用户没按压进度条圆点，拖动无效
    let x = e.touches[0].clientX, ln = 0;
    
    if(sliderW_record){//已经在播放时的拖动
      ln = x - startX + sliderW_record;
    } else {// 00:00 时拖动(加初始值22rpx),
      ln = x - startX + 22 * ratio;
    }
    if (ln < 0) ln = 22 * ratio;
    if (ln >= sliderMaxWidth) ln = sliderMaxWidth;
    this.setData({
      sliderW: ln + 'px',
    })
  },
  //拖动结束，手指松开
  end(){
    let len = this.data.sliderW.split('px')[0];
    this.setData({
      sliderW_record: Number(len),
    })
    console.log('完了' + len)
  },
  findWord(){//点击单词
    this.setData({
      coverFlag: false,
    })
  },
  close(){//关闭遮罩
    this.setData({
      coverFlag: true,
    })
  },
  translate(){//点击翻译
    this.setData({
      translate: !this.data.translate,
    })
  },
  toStudy(){//去练习
    wx.navigateTo({
      url: '../study/study',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  none() {//禁止遮罩冒泡
    return;
  },
  onLoad: function () {
    // wx.getUserInfo({
    //   success: res => {
    //     console.log(res)
    //     app.globalData.userInfo = res.userInfo
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })                 
    //   }
    // });
    let hour = new Date().getHours(),str='';
    console.log(hour)
    if(hour >= 0 && hour < 5 || hour >= 19 && hour <= 23){
      str = '晚上'
    }else if(hour >= 5 && hour < 9){
      str = '早上'
    }else if(hour >= 9 && hour < 12){
      str = '上午'
    }else if(hour == 12){
      str = '中午'
    }else if (hour > 12 &&  hour < 19) {
      str = '下午'
    }
    this.setData({
      helloStr: str,
    })
    
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
    // let menuBtn = wx.getMenuButtonBoundingClientRect();
    // // console.log(menuBtn,menuBtn.bottom -menuBtn.height/2)
    // this.setData({
    //   navbarH: menuBtn.bottom + 8,
    // });

    let query = wx.createSelectorQuery();
    query.select('.slider').boundingClientRect(rect=>{
      this.setData({
        sliderMaxWidth : rect.width,
      })
    }).exec();
    //获取设备信息
    wx.getSystemInfo({
      success:res=>{
        this.setData({
          //比例
          ratio: res.screenWidth / 750, 
        })
      }
    })

  },
  // aa(){
  //   let am = wx.createAnimation({
  //     duration: 300,
  //     timingFunction: 'ease-out',
  //   });
  //   am.opacity(1).scale(1, 1).translate(40, 0).step();
  //   this.setData({
  //     mm: am,
  //   })
  // },
  // go(){
  //   wx.navigateTo({
  //     url: '../home/home',
  //     success: function(res) {},
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })
  // },
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


// wx.loadFontFace({
    //   family: 'myff',
    //   source: 'url("https://sungd.github.io/Pacifico.ttf")',
    //   success: res => {
    //     // console.log(res)
    //   }
    // })

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