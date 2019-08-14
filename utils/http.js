const api_base_url = //"https://apiwx.yanxian.org/v1";//线上服务器

"http://202.85.213.24:8069/index.php/v1";//测试服务器

// const tips = {}
class HTTP {
  request(params) {
    if (!params.method) params.method = "GET"//默认为GET方式
    wx.request({
      url: api_base_url + params.url,//相同部分和不同的部分拼接
      method: params.method,
      data: params.data,
      header: {
        "content-type": 'application/json',
        //'appkey': config.appKey, //config.js文件中其它相同部分,如果有
        "token": params.token
      },
      success: res => {
        params.success(res)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
    wx.showLoading({
      title: '努力加载中...',
    })

  }
}

export { HTTP }