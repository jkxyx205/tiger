import request from '@/utils/request'

const DEV_BASE_URL = '/dev-api'

export function login(data) {
  return request({
    baseURL: DEV_BASE_URL,
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    baseURL: DEV_BASE_URL,
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    baseURL: DEV_BASE_URL,
    url: '/user/logout',
    method: 'post'
  })
}

export function changeStatus(id) {
  return request({
    url: `/api/tiger/platform/users/${id}/changeStatus`,
    method: 'put'
  })
}
