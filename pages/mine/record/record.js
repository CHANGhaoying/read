// pages/mine/son/record/record.js
import { HTTP } from '../../../utils/http.js'
const http = new HTTP();
import getToken from '../../../utils/getToken.js'
let page = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topH: getApp().globalData.menuBtn.bottom,//胶囊按钮的底部
    navItems:['单词','词组','长难句'],
    navIndex: 0,
    navHide: false,
    text:'学习记录',
    recordData:[],//学习记录数据
    url:'',//哪个接口
  },
  tapnav(e){//切换 单词 词组 长难句
    let { index } = e.currentTarget.dataset
    this.setData({
      navIndex: index,
    })
  },
  toShow(e) {//展开长难句or文章详情
    let { index, article_id } = e.currentTarget.dataset;
    getApp().globalData.cnj = this.data.recordData[index].cnj
    if (this.data.navHide) {//文章
      wx.navigateTo({ url: '/pages/index/index?id=' + article_id})//去index页面   
    } else {//长难句
      wx.navigateTo({ url: '../../study/study?flag=3&user_opt=' + this.data.recordData[index].user_opt })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    this.getData = function(url){
      this.setData({
        url: url
      })
      getToken(tk => {
        http.request({
          url: url,//学习记录or收藏的文章or往期文章 接口
          token: tk,
          data: {
            page: page,
            size: 10,
          },
          success: res => {
            console.log(res.data.data)
            if (res.data.data.length < 10) page=false;
            this.setData({
              recordData: this.data.recordData.concat(res.data.data)
            })
          }
        })
      })
    };
    if(options.flag){//来自收藏的文章 往期文章
      this.setData({
        navIndex: 2,
        navHide: true,
        text: options.flag == 1 ? '我收藏的文章' : '往期文章',
      })
      let url = options.flag == 1 ? '/personal/collect' : '/article/past';
      this.getData(url)
    } else {//来自首页
      this.getData('/personal/record')//学习记录
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
  onReachBottom: function (e) {
    if(page){
      page ++;
      this.getData(this.data.url)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().globalData.shareInfo
  }
})