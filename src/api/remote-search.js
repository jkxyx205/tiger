import request from '@/utils/request'

const DEV_BASE_URL = '/dev-api'

export function searchUser(name) {
  return request({
    baseURL: DEV_BASE_URL,
    url: '/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    baseURL: DEV_BASE_URL,
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}
