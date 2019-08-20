export const SEX_TYPE = 'SEX_TYPE_GET'
export const STATUS_TYPE = 'SATUS_TYPE_GET'

var mapping = {
  [SEX_TYPE]: {
    0: '男',
    1: '女',
    2: '保密'
  },
  [STATUS_TYPE]: {
    0: '正常',
    1: '禁用'
  }
}

export function getLabel(type, value) {
  return mapping[type][value]
}

export function getData(type) {
  return mapping[type]
}