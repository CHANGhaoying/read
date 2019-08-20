// pages/clock/clock.js
import { HTTP } from '../../utils/http.js'
const http = new HTTP();
import getToken from '../../utils/getToken.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasW: 0,//canvas宽高
    canvasH: 0,
    punch_days: '0',
  },
  save(){//保存图片
    wx.canvasToTempFilePath({//获取canvas生成的图片路径
      x: 0,//指定的画布区域的左上角横坐标
      y: 0,
      width: this.data.canvasW,//指定的画布区域的宽度
      height: this.data.canvasH,
      destWidth: this.data.canvasW,//输出的图片的宽度
      destHeight: this.data.canvasH,
      canvasId: 'canvas1',
      success: res => {
        // console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,//图片路径
          success: res => {
            wx.showModal({
              content: '图片已保存到相册，赶紧晒一下吧~',
              showCancel: false,
              confirmText: '好的',
              success: res => {
                if (res.confirm) {
                  // console.log('用户点击确定');
                }
              }
            })
          },
        })
      
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {name,url} = wx.getStorageSync('userData')
    getToken(tk => {
      http.request({
        url: '/personal/punch_days',
        token: tk,
        success: res => {
          this.setData({
            punch_days: res.data.punch_days,
          })
          
    wx.getImageInfo({//获取背景图片信息
      src: 'https://apiwx.yanxian.org/static/img/poster2.png',//服务器上图片
      success: bgInfo => {
        // console.log(bgInfo)
        wx.downloadFile({//下载网络头像到本地
          url: url,//用户头像路径
          success: avatar => {
            // console.log(avatar.tempFilePath);
            let { windowHeight, windowWidth } = getApp().globalData.systemInfo;//设备宽高  
            let { width, height } = bgInfo;//原图片宽高
            this.setData({
              canvasW: width,
              canvasH: height,
            })
            /*画布操作*/
            const ctx = wx.createCanvasContext('canvas1');
            //宽高与原图宽高一样
            ctx.drawImage(bgInfo.path, 0, 0, width, height);
            //保存当前的绘图上下文。
            ctx.save()
            //头像
            ctx.beginPath()//开始创建一个路径
            ctx.arc(65, 770, 32, 0, 2 * Math.PI, false)//画一个圆形裁剪区域
            ctx.clip()//裁剪
            ctx.drawImage(avatar.tempFilePath, 33, 738, 64, 64);
            //恢复之前保存的绘图上下文
            ctx.restore()
            //昵称
            ctx.setFontSize(28)
            ctx.setFillStyle('#191919') 
            ctx.fillText(name, 120, 783)
            //坚持天数
            ctx.setFillStyle('#fff')
            ctx.setFontSize(70)
            let days = res.data.punch_days + '';
            let n = 40 * (days.length - 1)
            ctx.fillText(days, 550-n, 602)
            
            ctx.draw()       
          }
        })
      }
    })//canvas画布↑

        }//天数接口
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