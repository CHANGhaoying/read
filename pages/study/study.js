// pages/study/study.js
import { HTTP } from '../../utils/http.js'
const http = new HTTP();
import getToken from '../../utils/getToken.js'
let { globalData } = getApp();//胶囊按钮的底部

Page({
  /**
   * 页面的初始数据
   */
  data: {
    whoShow: 1,//哪个页面显示
    topH: globalData.menuBtn.bottom + 5,//目录框（隐藏中）的顶高
    articleID: '',//文章id
    pullAnimation: {},//下拉动画
    passAnimation: {},//pass过关动画
    passStyle: 'transform:scale(1.6,1.6);bottom:-50rpx;opacity:0;',//pass过关图片状态
    wordData: [],//今日 单词
    phrase: [],//今日 词组
    new_words: [],//连连看 单词 
    new_phrase: [],//连连看 词组
    keys: [],//连连看单词 词组 的键数组
    clockTime: '00',//计时秒数
    gameArr: [],//存放被选中单词下标的数组
    gameAscii: '',//点击单词的阿斯克码
    select1:-1,//第一次点击（下标）
    select2: -1,//第二次点击（下标）
    gameFlag: true,//游戏开关
    isWord: 1,//是连连看单词还是词组
    cnj: {},
    cnjAnswer:'',
    permitLook: false,//允许查看长难句解析
    lookFlag: true,//查看解析
    coverHide: true,
    hideBtn: false,//查看排名隐藏显示
  },
  open() {//开启练习
    this.setData({
      whoShow: 2,
    })
    getToken(tk => {//this.data.articleID
      http.request({
        url: '/article/' + this.data.articleID + '/detail',
        success: res => {
          console.log(res.data)
          let keys = res.data.new_words.map(item => {
            return Object.keys(item)[0]
          })
          this.setData({
            wordData: res.data.words,
            phrase: res.data.phrase,
            new_words: res.data.new_words,
            new_phrase: res.data.new_phrase,
            keys: keys,
            cnj: res.data.cnj,
          })
        }
      })
    })
  },
  playWord(e) {//播放单词发音
    console.log(e.target.dataset.src)
    let audio = wx.createInnerAudioContext();
    audio.autoplay = true;
    audio.src = e.target.dataset.src;
  },
  myAnimation(){//动画效果方法
    let { ratio } = globalData;//设备 px 与 rpx 比例
    // 下拉动画
    let pullAnimation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    pullAnimation.height(150 * ratio).step();
    // 下拉动画执行
    this.setData({
      pullAnimation: pullAnimation.export(),
    })

    //过关pass动画延时执行
    setTimeout(() => {
      //过关pass动画
      let passAnimation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      });
      passAnimation.opacity(1).scale(1, 1).bottom(30 * ratio).step();
      this.setData({
        passAnimation: passAnimation.export(),
      })
    }, 500)
    //上拉收起动画延时（最后）执行
    setTimeout(() => {
      pullAnimation.height(0).step()
      this.setData({
        pullAnimation: pullAnimation.export()
      })
    }, 2000)
  },
  toplay() {//点击play按钮
    this.setData({
      whoShow: 3,
      gameArr: [],
    });
    let { clockTime } = this.data;
    let num = clockTime === '00' ? 0 : Number(clockTime);
    this.int = setInterval(()=>{
      num ++;
      let str = num < 10 ? '0' + num : '' + num;
      this.setData({
        clockTime: str,
      })
    },1000)
  },
  close(){//关闭连连看计时页面
    wx.showModal({
      content: '现在退出，打卡无效',
      cancelText: '退出',
      confirmText: '继续',
      cancelColor:'#999',
      confirmColor: '#20cf8f',
      success: res=>{
        if(res.cancel){//退出
          clearInterval(this.int)//清除定时器
          wx.navigateBack({
            delta:1,
          })
        }
      }
    })
  },
  game(e){//连连看游戏
    let { gameArr, gameAscii, gameFlag, select1 } = this.data
    let { ascii, index,tapflag } = e.target.dataset
    if (!gameFlag || tapflag || index == select1) return;//选够两个时or已消失的按钮or两次点击同一个时禁用
    if(gameAscii){//点的是第二个
      this.setData({
        gameAscii: '',
        select2: index,
        gameFlag: false,//关闭游戏
      })
      let letter1 = Number(gameAscii) ? String.fromCharCode(Number(gameAscii)) : gameAscii;
      let letter2 = Number(ascii) ? String.fromCharCode(Number(ascii)) : ascii;
      if(letter1 === letter2 ){//配对成功
        gameArr.push(this.data.select1)//加入1下标
        gameArr.push(this.data.select2)//加入2下标
        setTimeout(()=>{
          this.setData({
            gameArr: gameArr
          })
        },600)
      } 
      setTimeout(()=>{
        this.setData({
          select1: -1,
          select2: -1,
          gameFlag: true,//打开游戏
        })
      },700) 
    }else{//点第一个
      this.setData({
        gameAscii: ascii,//保存第一个阿斯克码
        select1: index,//保存第一个下标
      })
    }
    // console.log(gameArr,gameAscii)
    if(gameArr.length>=this.data.new_words.length){//全部正确消完
      clearInterval(this.int)//清除定时器
      let { phrase, new_phrase,isWord} = this.data
      let ws = isWord == 1 ? 2 : 4;//是练的单词就再来词组，是词组就去长难句
      let keys = new_phrase.map(item => {
        return Object.keys(item)[0]//收集键值
      })
      setTimeout(()=>{
        this.setData({
          whoShow: ws,
          wordData: phrase,//把词组数据给到页面（不需判断）
          new_words: new_phrase,
          keys: keys,
          isWord: isWord + 1,
        })
        this.myAnimation()
      },900)
      
    }
  },
  tapCnj(e){//选择长难句答案
    if(this.data.cnjAnswer) return;
    let { answer } = e.currentTarget.dataset
    this.setData({
      cnjAnswer: answer,
      isWord : 4,
    })
    this.myAnimation()//动画
  },
  look(){//查看长难句解析
    if(this.data.permitLook){
      this.setData({
        lookFlag:false,//解析页打开
      })
    }else{
      this.setData({
        coverHide: false,//分享页显示
      })
    }
  },
  share(){//去分享
    this.setData({
      coverHide: true,
      permitLook: true,
    })
  },
  toRanking(){//查看排名
   let {clockTime,articleID,cnjAnswer} = this.data
    wx.navigateTo({
      url: `../ranking/ranking?clockTime=${clockTime}&articleID=${articleID}&cnjAnswer=${cnjAnswer}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.flag == 3) {//来自学习记录
      this.setData({
        whoShow: 4,
        lookFlag: false,
        cnj:globalData.cnj,
        cnjAnswer: options.user_opt,
        hideBtn:true,
      })
    }else if (options.id) {//来自首页
      this.setData({
        articleID: options.id
      })
      if(options.flag == 2){//查看收藏或往期 进行的学习
        this.setData({
          hideBtn: true,
          permitLook: true,
        })
      }
    };
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {

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
    return getApp().globalData.shareInfo
  }
})