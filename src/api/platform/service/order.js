import request from '@/utils/request'

export function createJobOrder(data) {
  return request({
    url: `/api/tiger/platform/order/job-order/create`,
    method: 'post',
    data
  })
}

export function getJobOrderList(id) {
  return request({
    url: `/api/tiger/platform/order/jobs/${id}`,
    method: 'get'
  })
}

export function findDetailById(id) {
  return request({
    url: `/api/tiger/platform/order/${id}`,
    method: 'get'
  })
}

export function listLogs(orderId) {
  return request({
    url: `/api/tiger/platform/order/${orderId}/logs`,
    method: 'get'
  })
}
