import request from '@/utils/request'

const DEV_BASE_URL = '/dev-api'

export function getRoutes() {
  return request({
    baseURL: DEV_BASE_URL,
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    baseURL: DEV_BASE_URL,
    url: '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    baseURL: DEV_BASE_URL,
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    baseURL: DEV_BASE_URL,
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    baseURL: DEV_BASE_URL,
    url: `/role/${id}`,
    method: 'delete'
  })
}
