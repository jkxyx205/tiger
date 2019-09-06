import request from '@/utils/request'

/**
 * @param targetId
 * @param data
 * {
    "description": "get out!!!!!"
   }
 */
export function feedback(targetId, data, userId) {
  return request({
    url: `/api/tiger/platform/logs/${targetId}`,
    data,
    params: {
      userId
    },
    method: 'post'
  })
}

export function list(targetId) {
  return request({
    url: `/api/tiger/platform/logs/${targetId}`,
    method: 'get'
  })
}
