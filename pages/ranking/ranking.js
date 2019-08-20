// pages/ranking/ranking.js
import { HTTP } from '../../utils/http.js'
const http = new HTTP();
import getToken from '../../utils/getToken.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    self:{},
  },
  clock(){
    wx.navigateTo({
      url: '../clock/clock',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { clockTime, articleID, cnjAnswer } = options
    getToken(tk=>{
      http.request({
        url: '/record/leader_board',
        method: 'POST',
        token: tk,
        data:{
          article_id: articleID,
          game_time: clockTime,
          user_opt: cnjAnswer,
        },
        success: res=>{
          // console.log(res)
          wx.setStorageSync('id', articleID)
          this.setData({
            list: res.data.leaderBoard,
            self: res.data.mine,
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