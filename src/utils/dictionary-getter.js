export const SEX_TYPE = 'SEX_TYPE_GET'
export const STATUS_TYPE = 'SATUS_TYPE_GET'
export const JOB_STATUS_TYPE = 'JOB_SATUS_TYPE_GET'
export const JOB_TYPE = 'JOB_TYPE_GET'

var mapping = {
  [SEX_TYPE]: {
    0: '男',
    1: '女',
    2: '保密'
  },
  [STATUS_TYPE]: {
    0: '正常',
    1: '禁用'
  },
  [JOB_STATUS_TYPE]: {
    0: '已提交',
    1: '处理中',
    2: '待确认完成',
    3: '已完成',
    4: '已取消',
  },
  [JOB_TYPE]: {
    0: '系统故障',
    1: '建议反馈',
    2: '服务工单'
  }
}

export function getLabel(type, value) {
  return mapping[type][value]
}

export function getData(type) {
  return mapping[type]
}
