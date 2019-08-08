// pages/mine/son/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItems:['单词','词组','长难句'],
    navIndex: 0,
    navHide: false,
    text:'学习记录',
    wdt: [{ e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' },
    { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }, { e: 'harder', p: '[harder]', c: 'vt. 推测；猜测' }
    ],
  },
  tapnav(e){//切换 单词 词组 长难句
    let { index } = e.currentTarget.dataset
    this.setData({
      navIndex: index,
    })
  },
  toShow(){//展开长难句详情
    if(this.data.navHide){
      wx.reLaunch({ url: '/pages/index/index', })//关闭所有页面，打开index页面   
    }else{
      wx.navigateTo({ url: '../../study/study', })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.flag){
      this.setData({
        navIndex: 2,
        navHide: true,
        text: options.flag == 1 ? '我收藏的文章' : '往期文章',
      })
    }
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