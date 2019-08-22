import request from '@/utils/request'

export function changeStatus(id) {
  return request({
    url: `/api/tiger/platform/groups/${id}/changeStatus`,
    method: 'put'
  })
}

export function list() {
  return request({
    url: '/api/tiger/platform/groups',
    method: 'get',
    params: {
      page: 1,
      size: -1
    }
  })
}

export function dict(id) {
  return request({
    url: `/api/tiger/platform/groups/${id}/users/dict`,
    method: 'get'
  })
}
