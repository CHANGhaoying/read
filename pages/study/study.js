// pages/study/study.js
let { bottom } = getApp().globalData.menuBtn;//胶囊按钮的底部
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topH: bottom,//胶囊按钮的底部
    wdt: [{ e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' },
      { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }
    ],
    son: { "id": 150, "long_sentence": "2. Today, because of shrewd advertising and public health campaigns, many Americans habitually give their pearly whites a cavity-preventing scrub twice a day, often with Colgate, Crest or one of the other brands.", "word_parsing": [{ "us_audio": "http://58.87.104.85:9192/static/mp3/s/shrewd.mp3", "us_phonetic": "[ʃru:d]", "chinese_word": ["adj. 精明的，敏锐的；奸诈的"], "english_word": "shrewd" }, { "us_audio": "http://58.87.104.85:9192/static/mp3/c/campaigns.mp3", "us_phonetic": " [kæmˈpeɪnz] ", "chinese_word": ["n. 宣传活动"], "english_word": "campaigns" }, { "us_audio": "http://58.87.104.85:9192/static/mp3/c/cavity-preventing.mp3", "us_phonetic": " [ˈkævəti prɪˈventɪŋ] ", "chinese_word": ["口腔预防 "], "english_word": "cavity-preventing" }, { "us_audio": "http://58.87.104.85:9192/static/mp3/s/scrub.mp3", "us_phonetic": "[skrʌb]", "chinese_word": [" n. 擦洗"], "english_word": "scrub" }], "sentence_splitting": [{ "type": "5", "title": "Today," }, { "type": "5", "title": "because of shrewd advertising and public health campaigns," }, { "type": "1", "title": "many Americans" }, { "type": "5", "title": " habitually " }, { "type": "2", "title": "give" }, { "type": "3", "title": " their pearly whites a cavity-preventing scrub" }, { "type": "5", "title": " twice a day, often with Colgate, Crest or one of the other brands." }], "parsing": "本句主干为many Americans habitually give their pearly whites a cavity-preventing scrub twice a day，句中含有because of 引导的原因状语，以及with引导的方式状语，共同说明广告对美国人刷牙习惯的影响。注意此处pearly whites 指代“洁白牙齿”。", "translation": "而今天，受精明的广告活动和公共卫生的影响，许多美国人会习惯性地每天给他们那如珍珠般洁白的牙齿做两次 龋齿预防刷洗，他们使用的，往往就是高露洁，佳洁士或者其他某种品牌。", "analysis": "双宾语；独立主格", "currentNumber": 2 },
    lookFlag: false,//查看解析
  },
  look(){
    this.setData({
      lookFlag:false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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