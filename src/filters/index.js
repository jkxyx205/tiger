// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'
import * as Dict from '@/utils/dictionary-getter'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function orderStatus(value) {
  return Dict.getLabel(Dict.ORDER_STATUS, value)
}

export function orderType(value) {
  return Dict.getLabel(Dict.ORDER_TYPE, value)
}

export function invoiceStatus(value) {
  return Dict.getLabel(Dict.INVOICE_STATUS, value)
}

export function invoiceType(value) {
  return Dict.getLabel(Dict.INVOICE_TYPE, value)
}

export function jobStatus(value) {
  return Dict.getLabel(Dict.JOB_STATUS_TYPE, value)
}

export function jobType(value) {
  return Dict.getLabel(Dict.JOB_TYPE, value)
}

export function refundStatus(value) {
  return Dict.getLabel(Dict.REFUND_STATUS, value)
}

export function deployStatus(value) {
  return Dict.getLabel(Dict.DEPLOY_STATUS, value)
}

