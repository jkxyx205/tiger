import request from '@/utils/request'

export default class ListQuery {

  constructor(url) {
    this.url = url
  }

  // _extractData() {
  //   var formData = new FormData(this.formEl)
  //   this.formData = {};
  //   for (const [key, value]  of formData.entries()) {
  //       this.formData[key] = value;
  //   }
  //   return Object.assign({}, this.formData, this.extraData)
  // }

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