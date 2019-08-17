import request from '@/utils/request'

export function sendMessage(url, data) {
  return request({
    baseURL: null,
    url: url,
    method: 'post',
    data
  })
}
