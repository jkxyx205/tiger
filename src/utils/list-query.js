import request from '@/utils/request'

export default class ListQuery {
  constructor(url) {
    this.url = url
  }

  trigger(params) {
    // this.extraData = extraData

    return request({
      url: this.url,
      method: 'get',
      params: params
    }).then(res => {
      return Promise.resolve(res.data)
    })
  }
}
