import request from '@/utils/request'

export function changeStatus(id) {
  return request({
    url: `/api/tiger/platform/groups/${id}/changeStatus`,
    method: 'put'
  })
}
