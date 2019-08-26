import request from '@/utils/request'

export function createJobOrder(data) {
  return request({
    url: `/api/tiger/platform/order/job-order/create`,
    method: 'post',
    data
  })
}
