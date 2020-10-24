import request from '@/utils/request'

export function findAll({ page, size, mobile }) {
  return request({
    url: `/api/tiger/platform/platformLogs?page=${page}&size=${size}&mobile=${mobile}`,
    method: 'get'
  })
}
