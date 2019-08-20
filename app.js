//app.js
App({
  onLaunch: function () {
    //展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    
    //加入 新版本检测更新 提示用户
    if (wx.canIUse('getUpdateManager')) {//版本是否支持
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {//获取新版本信息
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {//下载好新版本
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，请重启应用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()//启用新版本
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {// 新版本下载失败
            wx.showModal({
              title: '新版本提示',
              content: '新版本自动升级失败，请您删除当前小程序，重新搜索打开'
            })
          })
        }
      })
    } else {//升级微信版本
      wx.showModal({
        title: '提示信息',
        content: '当前微信版本过低，无法使用自动更新小程序功能，请升级到最新微信版本。'
      })
    };
    wx.setInnerAudioOption({//音频播放设置项
      obeyMuteSwitch: false,// 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
      //全局生效
    })
    //获取设备信息
    wx.getSystemInfo({
      success: res => {
        // console.log(res)
        this.globalData.systemInfo = res;
        this.globalData.ratio = res.screenWidth / 750;
      }
    });
    
  },
  
  globalData: {
    userAllow: wx.getStorageSync('tk_info') ? true : false,//是否登录
    menuBtn: wx.getMenuButtonBoundingClientRect(),//胶囊按钮
    firstStatus: false,//首次授权需要查询文章收藏状态
    systemInfo:null,//设备信息
    ratio: 0.5,//设备屏幕比例
    cnj:null,
    shareInfo: {//用户分享的页面信息
      title: '英语阅读小程序',
      path: '/pages/index/index',
    },
  },
  
})
