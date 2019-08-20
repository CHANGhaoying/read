// pages/mine/mine.js
import { HTTP } from '../../utils/http.js'
const http = new HTTP();
import getToken from '../../utils/getToken.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { url: 'xxjl.png', txt: '学习记录' },
      { url: 'scwz.png', txt: '我收藏的文章' },
      { url: 'wqwz.png', txt: '往期文章' },
      // { url: 'about.png', txt: '关于我们' },
      { url: 'yxkt.png', txt: '研线课堂' }
    ],
    punch_days: 0,
  },
  goto(e){
    let { index } = e.currentTarget.dataset, url = '';
    switch (index) {
      case 0:
        url = 'record/record';//学习记录
        break;
      case 1:
        url = 'record/record?flag=1';//收藏的文章
        break;
      case 2:
        url = 'record/record?flag=2';//往期文章
        break;
      // case 3:
      //   url = 'h5/h5?flag=0';//关于我们
      //   break;
      default:
        url = 'h5/h5?flag=1';//研线课堂
    };
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getToken(tk=>{
      http.request({
        url:'/personal/punch_days',
        token: tk,
        success: res=>{
         this.setData({
           punch_days: res.data.punch_days,
         })
        }
      })
    })
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
    return getApp().globalData.shareInfo
  }
})