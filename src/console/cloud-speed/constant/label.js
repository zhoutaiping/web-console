const THREATEN_LEVEL = [
  {
    label: '高',
    value: 'high'
  },
  {
    label: '中',
    value: 'middle'
  },
  {
    label: '低',
    value: 'low'
  }
]

const STATUS_SWITCH = [
  {
    label: '开启',
    value: 'on'
  },
  {
    label: '关闭',
    value: 'off'
  }
]

const STATUS_SWITCH_NUMBER = [
  {
    label: '开启',
    value: 1
  },
  {
    label: '关闭',
    value: 0
  }
]

const WAF_MODE = [
  {
    value: 'active',
    label: '观察模式'
  },
  {
    value: 'block',
    label: '拦截模式'
  },
  {
    value: 'ban',
    label: '封禁模式'
  }
]

const WAF_LEVEL = [
  {
    label: '普通',
    value: 'general'
  },
  {
    label: '严格',
    value: 'strict'
  }
]

const WEB_HONEY_STATUS = [
  {
    value: 'default',
    label: '红网通用后台诱导'
  },
  {
    value: 'custom',
    label: '自有定制Web蜜网'
  }
]

const WEB_HONEY_CUSTOM_TYPE = [
  {
    label: '后台诱导',
    value: 'admin'
  },
  {
    label: '威胁设备诱导',
    value: 'threaten_equipment'
  }
]

const WAF_INTERCEPT_TYPE = [
  {
    value: 'default',
    label: '默认__companyEN__页面'
  },
  {
    value: 'custom',
    label: '自定义HTML'
  }
]

const CONTENT_REPLACE_MODE = [
  {
    value: 'default',
    label: '默认'
  },
  {
    value: 'custom',
    label: '自定义'
  },
  {
    value: 'mix',
    label: '混合模式'
  }
]

const DEFENSE_CC_STATUS = [
  {
    value: 'default',
    label: '默认'
  },
  {
    value: 'normal',
    label: '普通'
  },
  {
    value: 'strict',
    label: '严格'
  },
  {
    value: 'captcha',
    label: '验证码'
  }
]

const WEB_SNAPSHOT_ZONE_MODE = [
  {
    label: '不启用',
    value: 'no'
  },
  {
    label: '启用白名单',
    value: 'white'
  },
  {
    label: '启用黑名单',
    value: 'black'
  }
]

const WEB_SNAPSHOT_TIME_MODE = [
  {
    label: '全部时间',
    value: 'all'
  },
  {
    label: '指定时间白名单',
    value: 'custom'
  }
]

const WEEKS = [
  {
    label: '星期一',
    value: '1'
  },
  {
    label: '星期二',
    value: '2'
  },
  {
    label: '星期三',
    value: '3'
  },
  {
    label: '星期四',
    value: '4'
  },
  {
    label: '星期五',
    value: '5'
  },
  {
    label: '星期六',
    value: '6'
  },
  {
    label: '星期日',
    value: '0'
  }
]

const DEFENSE_REFER_MODE = [
  {
    label: '启用白名单',
    value: 'whiteList'
  },
  {
    label: '启用黑名单',
    value: 'blackList'
  }
]

const ZONE_LIMIT_MODE = [
  {
    label: '启用白名单',
    value: 'whiteList'
  },
  {
    label: '启用黑名单',
    value: 'blackList'
  }
]

const BACKUPS_TYPE = [
  {
    label: '首页',
    value: 0
  },
  {
    label: '全站',
    value: 1
  }
]

export default {
  THREATEN_LEVEL,
  STATUS_SWITCH,
  STATUS_SWITCH_NUMBER,
  WAF_MODE,
  WAF_LEVEL,
  WEB_HONEY_STATUS,
  WEB_HONEY_CUSTOM_TYPE,
  WAF_INTERCEPT_TYPE,
  CONTENT_REPLACE_MODE,
  DEFENSE_CC_STATUS,
  WEB_SNAPSHOT_ZONE_MODE,
  WEB_SNAPSHOT_TIME_MODE,
  WEEKS,
  DEFENSE_REFER_MODE,
  ZONE_LIMIT_MODE,
  BACKUPS_TYPE
}
