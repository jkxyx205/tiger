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

export function ok(id) {
  return request({
    url: `/api/tiger/platform/refund/${id}/opt/ok`,
    method: 'put'
  })
}

export function reject(id, remarks) {
  return request({
    url: `/api/tiger/platform/refund/${id}/opt/reject`,
    method: 'put',
    data: {
      remarks: remarks
    }
  })
}

export function finshed(id) {
  return request({
    url: `/api/tiger/platform/refund/${id}/opt/finshed`,
    method: 'put'
  })
}
