import request from '@/utils/request'

// const DEV_BASE_URL = process.env.VUE_APP_BASE_API // '/dev-api'

export function login(data) {
  return request({
    // baseURL: DEV_BASE_URL,
    // url: '/user/login',
    url: '/api/tiger/platform/master/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // baseURL: DEV_BASE_URL,
    // url: '/user/info',
    url: '/api/tiger/platform/master/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    // baseURL: DEV_BASE_URL,
    // url: '/user/logout',
    url: '/api/tiger/platform/master/user/logout',
    method: 'post'
  })
}

export function changeStatus(id) {
  return request({
    url: `/api/tiger/platform/users/${id}/changeStatus`,
    method: 'put'
  })
}

export function getUserById(id) {
  return request({
    url: `/api/tiger/platform/users/${id}`,
    method: 'get'
  })
}
