export const SEX_TYPE = 'SEX_TYPE_GET'
export const STATUS_TYPE = 'SATUS_TYPE_GET'
export const JOB_STATUS_TYPE = 'JOB_SATUS_TYPE_GET'
export const JOB_TYPE = 'JOB_TYPE_GET'

export const ORDER_TYPE = 'ORDER_TYPE_GET'
export const ORDER_STATUS = 'ORDER_STATUS_GET'

export const REFUND_STATUS = 'REFUND_STATUS_GET'
export const DEPLOY_STATUS = 'DEPLOY_STATUS_GET'
export const INVOICE_STATUS = 'INVOICE_STATUS'
export const INVOICE_TYPE = 'INVOICE_TYPE'

export const SITE_STATUS = 'SITE_STATUS'

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
    4: '已取消'
  },
  [JOB_TYPE]: {
    0: '服务工单',
    1: '系统故障',
    2: '建议反馈'
  },
  [ORDER_TYPE]: {
    0: '服务订单',
    1: '网站建设'
  },
  [ORDER_STATUS]: {
    0: '待支付',
    1: '已支付',
    2: '已作废'
  },
  [INVOICE_STATUS]: {
    0: '未开票',
    1: '开票中',
    2: '已开票'
  },
  [INVOICE_TYPE]: {
    0: '个人',
    1: '企业单位'
  },
  [REFUND_STATUS]: {
    0: '已提交',
    1: '已拒绝',
    2: '退款中',
    3: '已退款',
    4: '已作废'
  },
  [DEPLOY_STATUS]: {
    0: '待部署',
    1: '已作废',
    2: '部署中',
    3: '已拒绝',
    4: '已完成'
  },
  [SITE_STATUS]: {
    0: '试用中',
    1: '运行中',
    2: '停止',
    3: '停止',
    4: '过期'
  }
}

export function getLabel(type, value) {
  return mapping[type][value]
}

export function getData(type) {
  return mapping[type]
}
