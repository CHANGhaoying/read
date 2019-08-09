//index.js
//获取应用实例
// const app = getApp()
let { bottom } = getApp().globalData.menuBtn;//胶囊按钮的底部
Page({
  data: {
    helloStr: '',// 早上/上午...
    whoShow: 3,//封面 语录页 文章页 三者谁显示切换
    sayingCode:0,//四段动画语录依次显示
    sayingAnimat:{},//语录动画效果
    privateBarH: bottom + 8,//该页面私有的头部导航条（区别于自定义公共组件navbar）

    playflag: true,//播放 暂停音频
    duration: '00:00',//音频总长
    currentTime: '00:00',//当前播放时间
    second: 0,//音频总长秒数

    // screenWidth: 0,//屏幕宽度
    ratio: 0.5,//rpx与px的转换比例
    sliderW: 0,//进度条动态长度（初始值22rpx）
    sliderW_record: 0,//每次操作结束后的进度条长度记录
    startX: NaN,//进度条圆点的初始按压位置
    sliderMaxWidth:0,//进度条总长
    coverFlag: true,//搜索单词遮罩显示 隐藏
    translate: true,//译文隐藏 显示
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  open(){//开启今日阅读
    this.setData({
      whoShow: 2,
      sayingCode: 1,
    });
    //语录页显示，动画开始
    this.fade_in_out = function(flag, time) {//淡入淡出动画封装
      let animation = wx.createAnimation({
        duration: 1300,
        timingFunction: 'ease',
      });
      animation.opacity(flag).step();
      setTimeout(() => {
        this.setData({
          sayingAnimat: animation.export(),
        })
      },300);
    };
    this.fade_in_out(1);//淡入
    let n = 1;
    let interval = setInterval(() => {
      if (n >= 3) {
        clearInterval(interval)
      }
      n ++;
      this.setData({
        sayingCode: n,
      })
      this.fade_in_out(1)//淡入
    }, 1000);

    setTimeout(()=>{
      this.fade_in_out(0),//淡出
      setTimeout(()=>{
        this.setData({
          whoShow:3,
        })
      },1300)
    },5500)
  },
  toMine(){//去 我的个人中心
    wx.navigateTo({
      url: '../mine/mine',
    })
  },

  player(stop){//播放器
    let tim = wx.createInnerAudioContext()
    tim.autoplay = true
    tim.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    console.log(tim)
    // return
    // let music = wx.getBackgroundAudioManager();//背景音频
    // music.title = '此时此刻'
    // music.epname = '此时此刻'
    // music.singer = '许巍'
    // music.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    // // 设置了 src 之后会自动播放
    // music.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    // music.onPlay(()=>{
    //   if (stop) {//页面读取音频时长，读完即停
    //     this.setData({
    //       duration: parseInt(music.duration / 60)+':'+ parseInt(music.duration % 60),
    //       second: music.duration,
    //     })
    //     music.stop();
    //   }
    // })
    // music.onStop(function () {
      
    // })
  },
  play(e){
    console.log(this.data.sliderMaxWidth)
    
    this.setData({
      playflag: !this.data.playflag,
    })
    this.player();
    setInterval(()=>{
      let { sliderMaxWidth, second, sliderW } = this.data;
      this.setData({
        // 每十分之一秒加上应有的长度
        sliderW: sliderW + sliderMaxWidth / second / 10,
      })
    },100)
  },
  tap(e){
    console.log(e)
  },
  start(e) {//拖动开始
    this.setData({
      startX: e.touches[0].clientX,
    })
  },
  move(e) {//进度条拖动中
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
      sliderW: ln,
    })
  },
  end() {//拖动结束，手指松开
    this.setData({
      sliderW_record: this.data.sliderW,
    })
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
  none() { return },//禁止搜索单词遮罩冒泡
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
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        this.setData({
          ratio: res.screenWidth / 750,
          sliderW: 22 * res.screenWidth / 750,
        })
      },
    })


    let hour = new Date().getHours(),str='';
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
    // duration
    // number currentTim
    this.player(true)
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