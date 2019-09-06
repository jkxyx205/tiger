import request from '@/utils/request'

export function createJobDeploy(data) {
  return request({
    url: `/api/tiger/platform/deploy`,
    method: 'post',
    data
  })
}

export function findDetailById(id) {
  return request({
    url: `/api/tiger/platform/deploy/${id}`,
    method: 'get'
  })
}

export function getJobDeployList(id) {
  return request({
    url: `/api/tiger/platform/deploy/jobs/${id}`,
    method: 'get'
  })
}

export function changeStatus(deployId, status) {
  return request({
    url: `/api/tiger/platform/deploy/${deployId}/status/${status}`,
    method: 'put'
  })
}
