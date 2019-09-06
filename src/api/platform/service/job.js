import request from '@/utils/request'

export function findDetailById(id) {
  return request({
    url: `/api/tiger/platform/jobs/${id}`,
    method: 'get'
  })
}

export function changeStatus(jobId, status) {
  return request({
    url: `/api/tiger/platform/jobs/${jobId}/status/${status}`,
    method: 'put'
  })
}
