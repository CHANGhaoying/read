//index.js
const { globalData } = getApp()
import { HTTP } from '../../utils/http.js'
const http = new HTTP();
import getToken from '../../utils/getToken.js'
let { bottom } = getApp().globalData.menuBtn;//胶囊按钮的底部
const music = wx.getBackgroundAudioManager();//背景音频
let firstPlay = true;
Page({
  data: {
    privateBarH: bottom,//该页面私有的头部导航条（区别于自定义公共组件navbar）
    userAllow: globalData.userAllow,//是否登录
    navbarFlag: 1, //navbar显示返回箭头还是头像

    helloStr: '',// 早上/上午...
    whoShow: 1,//封面 语录页 文章页 三者谁显示切换
    sayingCode:0,//四段动画语录依次显示
    sayingAnimat:{},//语录动画效果
    sendWord:'',//封面寄语
    punchDays: 0,//坚持打卡天数
    sayings:[],//语录们

    pushDate:'',//文章日期
    info:{},//今日文章页面信息
    firstWord: '', //文章类型首字母（大写）
    articleType: '',//文章类型（不含首字母）
    articleID: -1,//文章id
    findWord:{},//点击带下划线单词的详情信息

    playflag: true,//播放 暂停音频
    duration: '00:00',//音频总长
    currentTime: '00:00',//当前播放时间
    seconds: 0,//音频总长秒数
    ratio: globalData.ratio,//rpx与px的转换比例

    sliderW: 22 * globalData.systemInfo.screenWidth / 750, 
    sliderW_record: 0,//每次操作前的进度条长度记录
    startX: NaN,//进度条圆点的初始按压位置
    sliderMaxWidth:0,//进度条总长

    nextFlag: 1,//下一项图片切换
    collectFlag: 1,//收藏图片切换
    translateFlag: 1,//翻译图片切换
    coverFlag: true,//搜索单词遮罩显示 隐藏
  },
  open(){//开启今日阅读
    this.setData({
      whoShow: 2,
      sayingCode: 1,
    });
    //语录页显示，动画开始
    this.fade_in_out = function(flag, time) {//淡入淡出动画封装
      let animation = wx.createAnimation({
        duration: 900,
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
    }, 900);
    setTimeout(()=>{
      this.fade_in_out(0),//淡出
      setTimeout(()=>{
        this.setData({
          whoShow:3,//显示文章页面
        });
        this.getArticleInfo()
      },800)
    },4500)
  },
  getArticleInfo(id){//获取文章信息
    let query = wx.createSelectorQuery();
    query.select('.slider').boundingClientRect(rect => {
      this.setData({
        sliderMaxWidth: rect.width,//获取进度条总长
      })
    }).exec();
    http.request({
      url: '/article/info',//文章接口
      data: {
        id: id || 25,
      },
      success: res => {
        console.log(res.data)
        this.formatDate(res.data.push_date);//格式化日期
        let type = res.data.english_name;
        let minute = parseInt(res.data.audio_time / 60), second = parseInt(res.data.audio_time % 60);
        this.setData({
          info: res.data,
          firstWord: type ? type[0].toUpperCase() : '',//文章类型首字母
          articleType: type ? type.slice(1, type.length) : '',//文章类型(不含首字母)
          articleID: res.data.id,//文章id
          duration: (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second),
        });
        if (globalData.userAllow) this.collectStatus(res.data.id)//如果登录过就查询文章收藏状态
      }
    })
  },
  formatDate(date){//格式化日期的方法
    let months= ['January', 'february', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let year = date.substr(0,4);
    let mon = date[5] == 0 ? months[date[6] - 1] : months[date.substr(5, 2) - 1];
    let day,str1,str2;
    if (date[8] == 0) {
      str1 = day = date.substr(9, 1)
    } else {
      str1 = day = date.substr(8, 2)
    };
    if (date[8] == 1 || date[9] >= 4 || date[9] == 0 ){
      str2 = 'th'
    } else if (date[9] == 1) {
      str2 = 'st'
    } else if (date[9] == 2) {
      str2 = 'nd'
    } else if (date[9] == 3) {
      str2 = 'rd'
    };
    day = str1 + str2;
    this.setData({
      pushDate: mon + '，' + day + '，' + year,
    })
  },
  toMine(){//去 我的个人中心
    if (globalData.userAllow){
      wx.navigateTo({
        url: '../mine/mine',
      })
    }else{
      wx.navigateTo({
        url: '../allow/allow?url=../mine/mine',
      })
    }
  },
  collectStatus(id) {//查询文章的收藏状态
    getToken(tk => {
      http.request({
        url: '/collect/' + id + '/status',
        token: tk,
        success: res => {
          // console.log(res.data)
          this.setData({
            collectFlag: res.data.status ? 2 : 1,
          })
        }
      })
    })
  },
  collect(e) {//收藏
    let { collectFlag, articleID } = this.data;
    if (articleID == -1) return;//文章没请求成功
    if (globalData.userAllow) {//已授权
      let url = collectFlag == 1 ? 'add' : 'cancel';
      getToken(tk=>{
        http.request({
          url: '/collect/' + url,//收藏或取消收藏
          method: 'POST',
          token: tk,
          data:{
            id: articleID,
          },
          success: res =>{
            console.log(res)
            this.setData({
              collectFlag: collectFlag == 1 ? 2 : 1,
            })
          }
        })
      })
    }else{
      wx.navigateTo({
        url: '../allow/allow',
      })
    }
  },
  translate() {//点击翻译
    if (this.data.articleID == -1) return;//文章没请求成功
    this.setData({
      translateFlag: this.data.translateFlag == 1 ? 2 : 1,
    })
  },
  toStudy() {//去练习（下一项）
    if (this.data.articleID == -1) return;//文章没请求成功
    this.setData({
      nextFlag:2,
    });
    let torage_id = wx.getStorageSync('id');
    if (this.data.articleID == torage_id){
      wx.showToast({
        title: '今日已打卡',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (globalData.userAllow) {
      wx.navigateTo({
        url: '../study/study?id=' + this.data.articleID + '&flag=' + this.data.navbarFlag,
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
      let {info} = this.data
      music.title = info.title
      music.coverImgUrl = 'http://b3-q.mafengwo.net/s7/M00/38/F0/wKgB6lRi9waAYDRbAAWy4MYwmtg84.jpeg';//info.audio_url
      // 设置了 src 之后会自动播放
      music.src = info.audio_url
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
        duration: (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second),
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
        playflag: true,//播放按钮复原
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
  findWord(e){//点击单词
    let { code, word } = e.currentTarget.dataset
    let {words} = this.data.info
    if (code){
      let item = words.filter(item=>{
        if (word == item.english_word) return item
      })
      this.setData({
        coverFlag: false,
        findWord: item[0],
      })
    }
  },
  playWord(e){//播放单词发音
    console.log(e.target.dataset.src)
    let audio = wx.createInnerAudioContext();
    audio.autoplay = true;
    audio.src = e.target.dataset.src;
  },
  close(){//关闭遮罩
    this.setData({
      coverFlag: true,
    })
  },
  none() { return },//禁止搜索单词遮罩冒泡
  onLoad: function (options) {
    wx.loadFontFace({//设置网络字体
      family: 'myff',
      source: 'url("https://apiwx.yanxian.org/static/font/f1.otf")',
      complete: res => {
        // console.log(res)
      }
    })

    if(options.id){//来自学习记录中往期文章 或 收藏的文章
      this.setData({
        whoShow: 3,
        navbarFlag: 2,//显示返回箭头
      })
      this.getArticleInfo(options.id)
    }
    
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
    getToken(tk=>{
      let str = tk ? 'success' : '';
      http.request({
        url: '/nav?sign=' + str,//首页寄语 气泡语录接口
        token: tk || '',
        success: res=>{
          // console.log(res)
          this.setData({
            sendWord: res.data.motivation,
            punchDays: res.data.punch_days || 0,
            sayings: res.data.quotations,
          })
        }
      });
    })
  },
  onReady(){
   
  },
  
  onShow(){
    this.setData({
      nextFlag: 1,
    });
    if (globalData.firstStatus) {//初次授权 查询文章是否收藏
      this.collectStatus(this.data.articleID)
      globalData.firstStatus = false;//关闭 以后都不需要在onShow函数中查询
    }

  },  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().globalData.shareInfo
  }
})