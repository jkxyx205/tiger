import request from '@/utils/request'

export function findAll(data) {
  return request({
    url: `/api/tiger/site/list?page=${data.page}&size=${data.size}`
  })
}

export function setExpiredDate(id, expiredDate) {
  return request({
    url: `/api/tiger/site/expire/${id}/expireAt/${expiredDate}`,
    method: 'post'
  })
}
