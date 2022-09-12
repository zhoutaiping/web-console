import { arrTest } from '@/utils/array'
import RULE from '@/utils/verify'
import { areaView } from '@/utils/filter'

const FORM_POLICY = {
  action: 'anticc',
  level: 'default',
  intval: null,
  time_unit: 'second',
  release: [],
  waf: 0,
  cc: 0,
  remark: ''
}

const FORM_TCP_POLICY = {
  action: 'deny',
  level: 'default',
  interval: null,
  time_unit: 'second',
  release: [],
  remark: ''
}

function validatorNumber(min, max) {
  return function intvalValidate(rule, value, callback) {
    if (!value) callback(new Error())
    const val = parseInt(value, 10)
    if (isNaN(val)) callback(new Error())

    if (min <= val && val <= max) {
      callback()
    } else {
      callback(new Error())
    }
  }
}

const FORM_POLICY_RULE = {
  intval: [
    { required: true, trigger: 'blur', message: '输入错误' },
    { validator: validatorNumber(1, 3600), message: '请填写 1 - 3600 的纯数字', trigger: 'blur' }
  ],
  intvalMinute: [
    { required: true, trigger: 'blur', message: '输入错误' },
    { validator: validatorNumber(1, 60), message: '请填写 1 - 60 的纯数字', trigger: 'blur' }
  ],
  intvalHour: [
    { required: true, trigger: 'blur', message: '输入错误' },
    { validator: validatorNumber(1, 24), message: '请填写 1 - 24 的纯数字', trigger: 'blur' }
  ],
  intvalDay: [
    { required: true, trigger: 'blur', message: '输入错误' },
    { validator: validatorNumber(1, 7), message: '请填写 1 - 7 的纯数字', trigger: 'blur' }
  ]
}

const FORM_TARGET = {
  referer: [],
  url: [],
  url_type: '',
  ip: [],
  regionTag: [],
  region: {},
  userAgent: [],
  userAgentSize: '',
  deviceType: [],
  deviceTypeView: '',
  args: '', // 请求参数
  reqs: null,
  postfix: '',
  req_method: [],
  ip_type: [],
  req_header_entry: '',
  querystring: '',
  req_time: ['', ''],
  startTime: '',
  startTimeView: '',
  endTime: '',
  weeks: [],
  key: '',
  value: '',
  status: [],
  header_key: '',
  header_value: '',
  header_value_list: [],
  req_time_sec: null,
  interval: null,
  req_protocol: []
}

const FORM_TCP_TARGET = {
  ip: [],
  regionTag: [],
  region: {},
  ip_type: [],
  tcp_ip_type: [],
  ip_rate_limit: {
    interval: null,
    reqs: null
  },
  tcp_service_port: [],
  tcp_new_connect: {
    reqs: null,
    interval: null
  },
  tcp_total_connect: {
    total: null
  },
  tcp_packet_head: [],
  tcp_packet_size: {
    size: null
  },
  tcp_response_packet_size: {
    size: null
  },
  tcp_connection_type: []
}

function ipVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    value = [value]
  } else {
    if (!value[0]) callback(new Error('请填写 IP'))
  }

  value.forEach(item => {
    if (!RULE.cidrREG.test(item) && !RULE.ipRangeReg.test(item)) {
      callback(new Error('IP 地址不正确'))
    }
  })
  callback()
}

function urlVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    value = [value]
  } else {
    if (!value[0]) callback(new Error('请填写 URL'))
  }

  if (arrTest(value, RULE.slashBegin)) {
    callback()
  } else {
    callback(new Error('URL 不正确'))
  }
}

function userAgentVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    if (!value) callback(new Error('请填写 UserAgent'))
  } else {
    if (!value[0]) callback(new Error('请填写 UserAgent'))
  }

  callback()
}

function refererVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    value = [value]
  } else {
    // if (!value[0]) callback(new Error('请填写 Referer'))
  }

  callback()
  // if (arrTest(value, RULE.refererDomain)) {
  // } else {
  //   callback(new Error('Referer 不正确'))
  // }
}

function validateReqTime(rule, value, callback) {
  if (value && value.length === 2) {
    // for (let i = 0; i < value.length; i++) {
    //   const item = value[i]
    //   if (!item || !(item instanceof Date)) {
    //     callback(new Error('格式不正确'))
    //   } else {
    //   }
    // }
    callback()
  } else {
    callback(new Error('请填写时间'))
  }
}

function validateReqMethod(rule, value, callback) {
  if (value.length === 0) {
    callback(new Error('请选择请求方法'))
  } else {
    callback()
  }
}

function validateDeviceType(rule, value, callback) {
  if (value.length === 0) {
    callback(new Error('请选择设备类型'))
  } else {
    callback()
  }
}

function validateIpType(rule, value, callback) {
  if (value.length === 0) {
    callback(new Error('请选择 IP 类型'))
  } else {
    callback()
  }
}

function validateWeeks(rule, value, callback) {
  if (value && value.length > 0) {
    callback()
  } else {
    callback(new Error('请选择周'))
  }
}

function validateRegion(rule, value, callback) {
  if (value && value.length > 0) {
    callback()
  } else {
    callback(new Error('请选择地区'))
  }
}

function validateStartTime(rule, value, callback) {
  if (typeof value === 'object') {
    callback()
  } else {
    callback(new Error('请选择开始时间'))
  }
}

const FORM_TARGET_RULES = {
  startTime: [{ validator: validateStartTime }],
  weeks: [{ validator: validateWeeks }],
  referer: [{ validator: refererVaildate, trigger: 'blur' }],
  regionTag: [
    {
      validator: validateRegion,
      trigger: 'blur'
    }
  ],
  url: [{ validator: urlVaildate, trigger: 'blur' }],
  // ip: [{ validator: ipVaildate, trigger: 'blur' }],
  area: [{ required: true, trigger: 'blur', message: '请选择区域' }],
  userAgent: [{ validator: userAgentVaildate, trigger: 'blur' }],
  deviceType: [{ validator: validateDeviceType, trigger: 'blur', message: '请选择' }],
  args: [{ required: true, trigger: 'blur', message: '请填写请求参数' }],
  req_time_sec: [
    {
      validator: validatorNumber(1, 20),
      trigger: 'blur',
      message: '请求频率时间有误（为 1 - 20 秒）'
    }
  ],
  interval: [
    {
      validator: validatorNumber(1, 20),
      trigger: 'blur',
      message: '请求频率时间有误（为 1 - 20 秒）'
    }
  ],
  reqs: [{ validator: validatorNumber(1, 1000), trigger: 'blur', message: '请求频率有误' }],
  postfix: [{ required: true, trigger: 'blur', message: '请填写后缀' }],
  req_method: [
    {
      trigger: 'blur',
      validator: validateReqMethod,
      message: '请选择请求方法'
    }
  ],
  ip_type: [{ validator: validateIpType, message: '请选择' }],
  upstream_status: [{ required: true, trigger: 'blur', message: '请填写源响应状态码' }],
  querystring: [{ required: true, trigger: 'blur', message: '请填写 QueryString' }],
  req_time: [{ validator: validateReqTime, trigger: 'blur', message: '请求时间有误' }],
  key: [{ required: true, trigger: 'blur', message: '请填写' }],
  value: [{ required: true, trigger: 'blur', message: '请填写参数值' }],

  status: [
    { required: true, trigger: 'blur', message: '请填写状态码' }
    // { validator: validator(RULE.statusCode, '状态码有误') }
  ],
  header_key: [{ required: true, trigger: 'blur', message: '请填写' }],
  header_value: [{ required: true, trigger: 'blur', message: '请填写请求参数' }],
  header_value_list: [{ required: true, type: 'array', trigger: 'blur', message: '请填写请求参数' }],
  req_protocol: [{ required: true, trigger: 'blur', message: '请填写' }]
}

const WEEKS_LIST = [
  {
    label: '周一',
    value: 1
  },
  {
    label: '周二',
    value: 2
  },
  {
    label: '周三',
    value: 3
  },
  {
    label: '周四',
    value: 4
  },
  {
    label: '周五',
    value: 5
  },
  {
    label: '周六',
    value: 6
  },
  {
    label: '周日',
    value: 0
  }
]

function formatRegionToTag(data) {
  const { country = [], province = [] } = data
  const regionTag = []

  country.forEach(item => {
    if (item === 'CN') {
      if (province.length > 0) {
        province.forEach(pItem => {
          if (pItem) {
            regionTag.push([item, pItem])
          }
        })
      } else {
        regionTag.push([item])
      }
    } else {
      regionTag.push([item])
    }
  })

  const arr = []
  regionTag.forEach(item => {
    arr.push(areaView(item))
  })

  return arr.join('|')
}

export {
  FORM_POLICY,
  FORM_TCP_POLICY,
  FORM_POLICY_RULE,
  FORM_TARGET,
  FORM_TCP_TARGET,
  FORM_TARGET_RULES,
  WEEKS_LIST,
  formatRegionToTag
}
