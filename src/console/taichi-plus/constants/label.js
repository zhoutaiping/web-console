const OPTIONS_TIMES = [
  {
    label: '1分钟',
    value: '1m'
  },
  {
    label: '5分钟',
    value: '5m'
  },
  {
    label: '10分钟',
    value: '10m'
  }
]

const DDOS_ORDER = [
  {
    label: '峰值带宽：降序',
    value: 'max_width|desc'
  },
  {
    label: '峰值带宽：升序',
    value: 'max_width|asc'
  },
  {
    label: '持续时间：降序',
    value: 'duration|desc'
  },
  {
    label: '持续时间：升序',
    value: 'duration|asc'
  }
]

export { OPTIONS_TIMES, DDOS_ORDER }
