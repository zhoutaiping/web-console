const TASK_CYCLE = [
  {
    label: '周报-周期',
    value: 3
  },
  {
    label: '月报-周期',
    value: 4
  }
]

const TASK_CYCLE_ALL = [
  {
    label: '定时报告',
    value: 1
  },
  {
    label: '一次执行',
    value: 2
  },
  {
    label: '周报-周期',
    value: 3
  },
  {
    label: '月报-周期',
    value: 4
  }
]
const CONTENT_SETTING = {
  'overview': '安全加速总览', // 安全加速总览
  'cdn': '访问加速详情', // 访问加速详情
  'waf': '漏洞入侵详情', // 漏洞入侵详情
  'cc': 'Web CC攻击详情' // web cc 攻击详情
}

const BUSINESS_TYPE = [
  {
    label: 'Web安全加速',
    value: 'webaqjs',
    content_setting: 'content_setting'
  },
  // {
  //   label: 'Web应用防火墙',
  //   value: 'hwws'
  // },
  {
    label: '高防IP',
    value: 'tjkd'
  }
]

const BUSINESS_TYPE_CHILD = [
  {
    label: 'Web安全加速',
    value: 'webaqjs'
  }
  // {
  //   label: 'Web应用防火墙',
  //   value: 'hwws'
  // },
  // {
  //   label: '高防IP',
  //   value: 'tjkd'
  // }
]
export default {
  TASK_CYCLE,
  BUSINESS_TYPE,
  BUSINESS_TYPE_CHILD,
  TASK_CYCLE_ALL,
  CONTENT_SETTING
}
