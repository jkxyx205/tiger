import request from '@/utils/request'

export function findDetailById(id) {
  return request({
    url: `/api/tiger/platform/jobs/${id}`,
    method: 'get'
  })
}

/**
 * @param jobId
 * @param data
 * {
    "description": "get out!!!!!"
   }
 */
export function feedback(jobId, data, userId) {
  return request({
    url: `/api/tiger/platform/jobs/${jobId}/logs`,
    data,
    params: {
      userId
    },
    method: 'post'
  })
}

export function listLogs(jobId) {
  return request({
    url: `/api/tiger/platform/jobs/${jobId}/logs`,
    method: 'get'
  })
}

export function changeStatus(jobId, status) {
  return request({
    url: `/api/tiger/platform/jobs/${jobId}/status/${status}`,
    method: 'put'
  })
}
