// pages/mine/mine.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { url: 'book2.png', txt: '学习记录' },
      { url: 'book2.png', txt: '我收藏的文章' },
      { url: 'book2.png', txt: '往期文章' },
      { url: 'book2.png', txt: '关于我们' },
      { url: 'book2.png', txt: '研线课堂' }
    ],
  },
  goto(e){
    let { index } = e.currentTarget.dataset, url = '';
    switch (index) {
      case 0:
        url = 'record/record';
        break;
      case 1:
        console.log("1");
        break;
      case 2:
        console.log("2");
        break;
      default:
        console.log("NaN");
    };
    wx.navigateTo({
      url: url,
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
    // console.log(getApp().globalData.menuBtn)
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