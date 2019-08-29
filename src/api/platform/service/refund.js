import request from '@/utils/request'

export function findDetailById(id) {
  return request({
    url: `/api/tiger/platform/refund/${id}`,
    method: 'get'
  })
}

export function listLogs(orderId) {
  return request({
    url: `/api/tiger/platform/refund/${orderId}/refundLogs`,
    method: 'get'
  })
}
