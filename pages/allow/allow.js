// pages/allow/allow.js
import getToken from '../../utils/getToken.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goto: '',
  },
  allow(e){
    // console.log(e)
    if (e.detail.userInfo){//允许了
      getApp().globalData.firstStatus = true;//首次授权需要查询文章收藏状态
      getApp().globalData.userAllow = true;
      
      //解构 昵称 头像
      let { nickName, avatarUrl } = e.detail.userInfo;
      getToken(tk => {//获取token的全局公共方法
        console.log(tk)
        if (this.data.goto) {
          wx.redirectTo({
            url: this.data.goto,//去 '我的'或者'下一项'
          })
        } else {
          wx.navigateBack({
            delta: 1,//返回上一页（点收藏触发的授权）
          })
        };
      }, nickName, avatarUrl)
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.url){
      this.setData({
        goto: options.url,
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
    return getApp().globalData.shareInfo
  }
})