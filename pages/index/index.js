//index.js
import { HTTP } from '../../utils/http.js'
const http = new HTTP();
let { bottom } = getApp().globalData.menuBtn;//胶囊按钮的底部
const music = wx.getBackgroundAudioManager();//背景音频
let firstPlay = true;
Page({
  data: {
    userAllow: false,//用户是否授权登录

    privateBarH: bottom + 8,//该页面私有的头部导航条（区别于自定义公共组件navbar）

    helloStr: '',// 早上/上午...
    whoShow: 3,//封面 语录页 文章页 三者谁显示切换
    sayingCode:0,//四段动画语录依次显示
    sayingAnimat:{},//语录动画效果
    sendWord:'',//封面寄语
    punchDays: 0,//坚持打卡天数
    sayings:[],//语录们

    




    playflag: true,//播放 暂停音频
    duration: '00:00',//音频总长
    currentTime: '00:00',//当前播放时间
    seconds: 0,//音频总长秒数
    ratio: 0.5,//rpx与px的转换比例
    sliderW: 0,//进度条动态长度（初始值22rpx）
    sliderW_record: 0,//每次操作前的进度条长度记录
    startX: NaN,//进度条圆点的初始按压位置
    sliderMaxWidth:0,//进度条总长

    nextFlag: 1,//下一项图片切换
    collectFlag: 1,//收藏图片切换
    translateFlag: 1,//翻译图片切换

    coverFlag: true,//搜索单词遮罩显示 隐藏
    // translate: true,//译文隐藏 显示
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
  formatDate(){//定义格式化日期的方法
    let date ="2019-11-02";
    let months= ['January', 'february', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // let arr = date.split('-')
    // console.log(date[5])
    // if(date[5] == 0){
    //   console.log(months[date[6]-1])
    // }else{
    //   console.log(months[date.substr(5,2)-1])
    // }
    let mon = date[5] == 0 ? months[date[6] - 1] : months[date.substr(5, 2) - 1];
    

  },
  toMine(){//去 我的个人中心
    if(this.data.userAllow){
      wx.navigateTo({
        url: '../mine/mine',
      })
    }else{
      wx.navigateTo({
        url: '../allow/allow?url=../mine/mine',
      })
    }
   
  },
  collect(e){//收藏
    this.setData({
      collectFlag: this.data.collectFlag == 1 ? 2 : 1,
    })
  },
  translate() {//点击翻译
    this.setData({
      translateFlag: this.data.translateFlag == 1 ? 2 : 1,
    })
  },
  toStudy() {//去练习
    this.setData({
      nextFlag:2,
    });
    if (this.data.userAllow) {
      wx.navigateTo({
        url: '../study/study',
      })
    } else {
      wx.navigateTo({
        url: '../allow/allow?url=../study/study',
      })
    }
  },
  play(){//播放
    if(firstPlay){//初次点击播放
      firstPlay = false;//已经首次点击过播放，把判断值改为false
      music.title = '此时此刻'
      music.epname = '此时此刻'
      music.singer = '许巍'
      music.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
      // 设置了 src 之后会自动播放
      music.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46';
    }else{//非初次点击播放暂停按钮
      if (this.data.playflag) {//播放
        music.play()
      } else {//暂停
        music.pause();
      }
    };
    music.onPlay(() => {//监听到播放
      let minute = parseInt(music.duration / 60), second = parseInt(music.duration % 60);
      let { sliderMaxWidth } = this.data;
      this.setData({
        playflag: false,
        duration: (minute < 10 ? "0" + minute : minute) + ":" + second,
        seconds: music.duration, //总秒数
      });
     
    });
    music.onPause(()=>{//监听到暂停
      this.setData({
        playflag:true,
      })
    });
    music.onStop(()=>{//监听背景音频关闭
      this.setData({
        currentTime: '00:00',
        sliderW: 22 * this.data.ratio,
      })
    })
    music.onTimeUpdate(() => {//监听背景音频播放进度更新
      let minute = parseInt(music.currentTime / 60), second = parseInt(music.currentTime % 60);
      let { ratio, sliderMaxWidth, seconds} = this.data;
      let newSliderW = 22 * ratio + sliderMaxWidth * music.currentTime / seconds;
      if (newSliderW >= sliderMaxWidth) newSliderW = sliderMaxWidth;
      this.setData({
        currentTime: (minute < 10 ? "0" + minute : minute) + ':' + (second < 10 ? "0" + second : second),
        sliderW: newSliderW,
      })
    });
    music.onEnded(() => {//监听播放结束
      this.setData({
        playflag: true,//播放按钮复原
        currentTime:'00:00',
        sliderW: 22 * this.data.ratio,
      })
    });
  },
  
  start(e) {//拖动开始
    if(!firstPlay){//已经开始播放
      this.setData({
        startX: e.touches[0].clientX,
        sliderW_record: this.data.sliderW,//当前位置记录下来
      })
    }
  },
  move(e) {//进度条拖动中
    let { startX, sliderW_record, sliderMaxWidth,ratio } = this.data;
    if (!startX) return;//如果用户没按压进度条圆点，拖动无效
    let x = e.touches[0].clientX, ln = x - startX + sliderW_record;;

    
    if (ln < 0) ln = 22 * ratio;
    if (ln >= sliderMaxWidth) ln = sliderMaxWidth;
    this.setData({
      sliderW: ln,
    })
  },
  end() {//拖动结束，手指松开
    let { seconds, sliderW, sliderMaxWidth} = this.data;
    let seekTime = seconds * sliderW / sliderMaxWidth;
    if(!firstPlay){
      music.seek(seekTime);
      music.play();
    }
  },
  tapSlider(e){//点击进度条某处
    if(firstPlay)return;
    let { sliderMaxWidth, ratio, play, seconds} = this.data;
    let w = e.touches[0].clientX-e.currentTarget.offsetLeft;
    if (w < 22 * ratio) w = 22 * ratio;
    if (w >= sliderMaxWidth) w = sliderMaxWidth;
    this.setData({
      sliderW: w
    })
    music.seek(seconds * w / sliderMaxWidth);
    music.play()

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
  
  none() { return },//禁止搜索单词遮罩冒泡
  onLoad: function () {
    this.formatDate()
    // wx.getUserInfo({
    //   success: res => {
    //     console.log(res)
    //     // app.globalData.userInfo = res.userInfo
    //     // this.setData({
    //     //   userInfo: res.userInfo,
    //     //   hasUserInfo: true
    //     // })                 
    //   },
    //   fail:res=>{
    //     console.log(res)
    //   }
    // });

    let query = wx.createSelectorQuery();
    query.select('.slider').boundingClientRect(rect => {
      this.setData({
        sliderMaxWidth: rect.width,
      })
    }).exec();
    //获取设备信息
    wx.getSystemInfo({
      success: res => {
        this.setData({
          //比例
          ratio: res.screenWidth / 750,
          sliderW: 22 * res.screenWidth / 750,
        })
      }
    })

    //判断时间段
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
    });

    http.request({
      url: '/nav',//首页寄语 气泡语录接口
      method: 'GET',
      data:{

      },
      success: res=>{
        console.log(res)
        this.setData({
          sendWord: res.data.motivation,
          punchDays: res.data.punch_days || 0,
          sayings: res.data.quotations,
        })
      }
    });
    http.request({
      url: '/article/info',//文章接口
      method: 'GET',
      data: {
        id: 21,
      },
      success: res => {
        console.log(res)
        // this.setData({
        //   sendWord: res.data.motivation,
        //   punchDays: res.data.punch_days || 0,
        //   sayings: res.data.quotations,
        // })
      }
    })
    

  },
  onReady(){
    
    // let n = 0
    // playInterval = setInterval(()=>{
    //   console.log(777)
    //   n++
    //   if(n>=100){
    //     clearInterval(playInterval)
    //   }
      
    // },100)
  },
  onShow(){
    this.setData({
      nextFlag: 1,
    });
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {//用户授过权，登录过
          this.setData({
            userAllow: true,
          })
        }
      }
    });
    // let menuBtn = wx.getMenuButtonBoundingClientRect();
    // // console.log(menuBtn,menuBtn.bottom -menuBtn.height/2)
    // this.setData({
    //   navbarH: menuBtn.bottom + 8,
    // });

    

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