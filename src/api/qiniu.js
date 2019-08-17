import request from '@/utils/request'

const DEV_BASE_URL = '/dev-api'

export function getToken() {
  return request({
    baseURL: DEV_BASE_URL,
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}
