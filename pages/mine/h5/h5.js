// pages/mine/h5/h5.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'https://mk.yanxian.org/',
    flag: '',
  },
  onLoad(options){
    this.setData({
      flag: Number(options.flag)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})