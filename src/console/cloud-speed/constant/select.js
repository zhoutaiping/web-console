const MIN_VERSION = [
  { label: 'SSLv3', value: 'SSLv3' },
  { label: 'TLSv1.0', value: 'TLSv1.0' },
  { label: 'TLSv1.1', value: 'TLSv1.1' },
  { label: 'TLSv1.2', value: 'TLSv1.2' }
]

const CDN_ACCOUNTING_RULES = [
  {
    label: '按流量计费',
    value: 1
  },
  {
    label: '按带宽峰值',
    value: 2
  }
]

const IP_VIEW = [
  {
    label: '主线路',
    value: 'primary'
  },
  {
    label: '备线路',
    value: 'backup'
  }
]

const PROTOCOL_TYPE = [
  {
    label: 'HTTP',
    value: 0
  },
  {
    label: 'HTTPS',
    value: 1
  }
]

const SOURCE_PROTOCOL = [
  {
    label: 'HTTP',
    value: 0
  },
  {
    label: 'HTTPS',
    value: 1
  },
  {
    label: '协议跟随',
    value: 2
  }
]

const PORT_80443 = [
  {
    label: '80',
    value: '80'
  },
  {
    label: '443',
    value: '443'
  }
]

const BALANCING_TYPE = [
  {
    label: '轮询',
    value: 1
  },
  {
    label: 'IP哈希',
    value: 0
  },
  {
    label: 'COOKIE粘住',
    value: 2
  }
]

const RETURN_SETTING = [
  {
    label: '回源到IP',
    value: 0
  },
  {
    label: '回源到域名',
    value: 1
  }
]

const PRIORITY_RATE = [
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '3',
    value: 3
  },
  {
    label: '4',
    value: 4
  },
  {
    label: '5',
    value: 5
  },
  {
    label: '6',
    value: 6
  },
  {
    label: '7',
    value: 7
  },
  {
    label: '8',
    value: 8
  },
  {
    label: '9',
    value: 9
  },
  {
    label: '10',
    value: 10
  }
]

const SWITCH = [
  {
    label: '开启',
    value: 'on'
  },
  {
    label: '关闭',
    value: 'off'
  }
]

const SWITCH_NUM = [
  {
    label: '开启',
    value: 1
  },
  {
    label: '关闭',
    value: 0
  }
]

const SWITCH_NUM_REVERSE = [
  {
    label: '开启',
    value: 0
  },
  {
    label: '关闭',
    value: 1
  }
]

const SWITCH_M2 = [
  {
    label: 'ON',
    value: 'on'
  },
  {
    label: 'OFF',
    value: 'off'
  }
]

const PAGE_404 = [
  {
    value: 'origin',
    label: '默认源站错误页面'
  },
  {
    value: 'custom',
    label: '自定义 HTML'
  },
  {
    value: 'app404',
    label: '公益 404'
  }
]

const PAGE_500 = [
  {
    value: 'default',
    label: '默认__companyEN__错误页面'
  },
  {
    value: 'origin',
    label: '默认源站错误页面'
  },
  {
    value: 'custom',
    label: '自定义 HTML'
  }
]

const PAGE_502 = [
  {
    value: 'default',
    label: '默认__companyEN__错误页面'
  },
  {
    value: 'origin',
    label: '默认源站错误页面'
  },
  {
    value: 'custom',
    label: '自定义 HTML'
  }
]

const HEADER_LIST = [
  {
    label: 'Cache-Control',
    value: 'Cache-Control',
    tips: '指定客户程序请求和响应遵循的缓存机制'
  },
  {
    label: 'Content-Disposition',
    value: 'Content-Disposition',
    tips: '指定客户程序响应对象时激活文件下载设置默认的文件名'
  },
  {
    label: 'Content-Language',
    value: 'Content-Language',
    tips: '指定客户程序响应对象的语言'
  },
  {
    label: 'Expires',
    value: 'Expires',
    tips: '指定客户程序响应对象的过期时间'
  },
  {
    label: 'Access-Control-Allow-Origin',
    value: 'Access-Control-Allow-Origin',
    tips: '指定允许的跨域请求的来源'
  },
  {
    label: 'Access-Control-Allow-Methods',
    value: 'Access-Control-Allow-Methods',
    tips: '指定允许的跨域请求方法'
  },
  {
    label: 'Access-Control-Allow-Credentials',
    value: 'Access-Control-Allow-Credentials',
    tips: '跨域请求时是否带Cookie的设置'
  },
  {
    label: 'Access-Control-Max-Age',
    value: 'Access-Control-Max-Age',
    tips: '指定客户程序对特定资源的预取请求返回结果的缓存时间'
  },
  {
    label: 'Access-Control-Expose-Headers',
    value: 'Access-Control-Expose-Headers',
    tips: '指定允许访问的自定义头信息'
  },
  {
    label: '自定义',
    value: 'custom',
    tips: '请输入响应头匹配内容'
  }
]

const CC_OPTIONS = [
  {
    value: 'off',
    label: 'OFF'
  },
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

const EDIT_TYPE = [
  {
    label: '新增',
    value: 'append'
  },
  {
    label: '修改',
    value: 'rewrite'
  }
]

const EDIT_TYPE_M2 = [
  {
    label: '追加',
    value: 'append'
  },
  {
    label: '覆盖添加',
    value: 'rewrite'
  }
]

const BLACK_LIST_TYPE = [
  {
    value: 'ip',
    label: 'IP'
  },
  {
    value: 'url',
    label: '站内URL'
  }
]

const BLACK_WB_LIST = [
  {
    label: '黑名单模式',
    value: 'blackList'
  },
  {
    label: '白名单模式',
    value: 'whiteList'
  }
]

const CDN_CACHE_TIME = [
  {
    value: 'second',
    label: '秒'
  },
  {
    value: 'minute',
    label: '分钟'
  },
  {
    value: 'hour',
    label: '小时'
  },
  {
    value: 'day',
    label: '天'
  },
  {
    value: 'month',
    label: '月'
  }
]

const CDN_CACHE_TYPE = [
  {
    label: '缓存',
    value: 'yes'
  },
  {
    label: '不缓存',
    value: 'no'
  }
]

const CDN_RULES_TYPE = [
  {
    value: 'suffix',
    label: '后缀名'
  },
  {
    value: 'equal',
    label: '精确匹配'
  },
  {
    value: 'match',
    label: '模糊匹配'
  },
  {
    value: 'dir',
    label: '目录'
  },
  {
    value: 'tourist',
    label: '游客'
  }
]

const CDN_RULES_TYPE_M2 = [
  {
    value: 'suffix',
    label: '后缀名'
  },
  {
    value: 'equal',
    label: '精确匹配'
  },
  {
    value: 'match',
    label: '模糊匹配'
  },
  {
    value: 'dir',
    label: '目录'
  }
]

const DOMAIN_NODE_OPTIONS = [
  {
    value: '0',
    label: '回源'
  },
  {
    value: '1',
    label: 'Web安全加速网络'
  },
  {
    value: '2',
    label: 'TCP安全加速网络',
    envHidden: ['baishan']
  }
]

const PROTECTED_MODE = [
  {
    value: 1,
    label: 'CNAME'
  },
  {
    value: 2,
    label: 'NS'
  }
]

export default {
  MIN_VERSION,
  CDN_ACCOUNTING_RULES,
  PORT_80443,
  IP_VIEW,
  PROTOCOL_TYPE,
  SOURCE_PROTOCOL,
  BALANCING_TYPE,
  RETURN_SETTING,
  PRIORITY_RATE,
  SWITCH,
  SWITCH_NUM,
  SWITCH_NUM_REVERSE,
  SWITCH_M2,
  PAGE_404,
  PAGE_500,
  PAGE_502,
  HEADER_LIST,
  CC_OPTIONS,
  EDIT_TYPE,
  EDIT_TYPE_M2,
  BLACK_LIST_TYPE,
  BLACK_WB_LIST,
  CDN_CACHE_TIME,
  CDN_CACHE_TYPE,
  CDN_RULES_TYPE,
  CDN_RULES_TYPE_M2,
  DOMAIN_NODE_OPTIONS,
  PROTECTED_MODE
}
