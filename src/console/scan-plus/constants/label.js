const SCAN_STATUS = [
  {
    label: '未开始',
    value: '0',
    color: 'default'
  },
  {
    label: '准备中',
    value: '1',
    color: 'warning'
  },
  {
    label: '进行中',
    value: '2',
    color: 'primary'
  },
  {
    label: '已完成',
    value: '3',
    color: 'success'
  }
]

const HOST_SCAN_STATUS = [
  {
    label: '未扫描',
    value: 1,
    color: 'danger'
  },
  {
    label: '扫描中',
    value: 2,
    color: 'primary'
  },
  {
    label: '扫描完成',
    value: 3,
    color: 'success'
  },
  {
    label: '已暂停',
    value: 4,
    color: 'warning'
  },
  {
    label: '已取消',
    value: 5,
    color: 'danger'
  }
]

const MONITOR_STATUS = [
  {
    label: '未开始',
    value: '0',
    color: 'default'
  },
  {
    label: '监测中',
    value: '1',
    color: 'success'
  },
  {
    label: '已关闭',
    value: '2',
    color: 'warning'
  },
  {
    label: '已到期',
    value: '3',
    color: 'danger'
  }
]

const DDOS_MONITOR_STATUS = [
  {
    label: '删除',
    value: -1,
    color: 'default'
  },
  {
    label: '停用',
    value: 0,
    color: 'error'
  },
  {
    label: '启用',
    value: 1,
    color: 'success'
  },
  {
    label: '过期',
    value: 2,
    color: 'danger'
  }
]

const RISK_TYPE = [
  {
    label: '全部',
    value: -1
  },
  {
    label: '篡改',
    value: 0
  },
  {
    label: '敏感词',
    value: 1
  },
  {
    label: '关键字',
    value: 2
  },
  {
    label: '异常状态码',
    value: 3
  },
  {
    label: '恶意链接',
    value: 4
  }
]

const LOGIN_TYPE = [
  {
    label: '无',
    value: 3
  },
  {
    label: 'Password',
    value: 1
  },
  {
    label: 'SSH Key',
    value: 2
  }
]

const SCAN_MODE = [
  {
    label: '快速',
    value: 1
  },
  {
    label: '准确',
    value: 2
  },
  {
    label: '全面',
    value: 3
  }
]

const TIMING_SETTING = [
  {
    label: '立即执行',
    value: 1
  },
  {
    label: '计划任务',
    value: 2
  }
]

const SCAN_CYCLE = [
  {
    label: '每小时',
    value: 'hour',
    placeholder: '1 - 24'
  },
  {
    label: '每周',
    value: 'week',
    placeholder: '1 - 10'
  },
  {
    label: '每月',
    value: 'month',
    placeholder: '1 - 24'
  }
]

const PLAN_UNIT = [
  {
    label: '小时',
    value: 'hour'
  },
  {
    label: '周',
    value: 'week'
  },
  {
    label: '月',
    value: 'month'
  }
]

const PORT_MODE = [
  {
    label: 'TCP/UDP',
    value: 'TCP/UDP'
  },
  {
    label: 'TCP',
    value: 'TCP'
  },
  {
    label: 'TCP2000/UDP100',
    value: 'TCP2000/UDP100'
  }
]

const NOTICE_TYPE = [
  {
    label: '短信',
    value: 1
  },
  {
    label: '邮件',
    value: 0
  }
]

const NOTICE_TYPE_M2 = [
  {
    label: '短信',
    value: 'sms'
  },
  {
    label: '邮件',
    value: 'email'
  }
]

const REPORT_THREAT = [
  {
    label: '低危',
    value: 'low',
    color: 'primary'
  },
  {
    label: '中危',
    value: 'medium',
    color: 'warning'
  },
  {
    label: '高危',
    value: 'hole',
    color: 'danger'
  },
  {
    label: '消息',
    value: 'info',
    color: 'primary'
  }
]

const MONITOR_ITEM = [
  {
    label: '篡改监控',
    value: 0
  },
  {
    label: '敏感词监控',
    value: 1
  },
  {
    label: '关键词 (请在添加后，前往监测控制台开启功能)',
    value: 2,
    disabled: true
  },
  {
    label: '异常状态码监控',
    value: 3
  },
  {
    label: '恶意链接监控',
    value: 4
  }
]

const IP_TYPE = [
  {
    label: 'IP',
    value: 1
  },
  {
    label: 'C段',
    value: 2
  }
]

const ALERT_CONTROL = [
  {
    label: '半小时',
    value: ''
  },
  {
    label: '1小时',
    value: ''
  },
  {
    label: '2小时',
    value: ''
  },
  {
    label: '4小时',
    value: ''
  },
  {
    label: '8小时',
    value: ''
  },
  {
    label: '24小时',
    value: ''
  }
]

const ISP_TYPE = [
  {
    label: '电信',
    value: '电信'
  },
  {
    label: '联通',
    value: '联通'
  },
  {
    label: '移动',
    value: '移动'
  },
  {
    label: '长城',
    value: '长城'
  },
  {
    label: '铁通',
    value: '铁通'
  },
  {
    label: '教育网',
    value: '教育网'
  }
]

export default {
  SCAN_STATUS,
  HOST_SCAN_STATUS,
  MONITOR_STATUS,
  DDOS_MONITOR_STATUS,
  RISK_TYPE,
  LOGIN_TYPE,
  SCAN_MODE,
  TIMING_SETTING,
  SCAN_CYCLE,
  PORT_MODE,
  NOTICE_TYPE,
  NOTICE_TYPE_M2,
  PLAN_UNIT,
  REPORT_THREAT,
  MONITOR_ITEM,
  IP_TYPE,
  ALERT_CONTROL,
  ISP_TYPE
}
