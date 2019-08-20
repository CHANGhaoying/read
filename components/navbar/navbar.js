// components/navbar/navbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: String,
    flag: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    topH: getApp().globalData.menuBtn.bottom,//胶囊按钮的底部
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back(){
      wx.navigateBack({delta:1})
    },
    toMine(e){
      this.triggerEvent('toMine')
    }
  }
})
