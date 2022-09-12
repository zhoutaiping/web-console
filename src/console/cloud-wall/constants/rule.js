function validatorNumber(min, max) {
  return function intvalValidate(rule, value, callback) {
    if (!value) callback(new Error())

    if (isNaN(value)) {
      callback(new Error())
    }

    const val = parseInt(value, 10)

    if (isNaN(val)) callback(new Error())

    if (min <= val && val <= max) {
      callback()
    } else {
      callback(new Error())
    }
  }
}

function validateRegion(rule, value, callback) {
  if (value && value.length > 0) {
    callback()
  } else {
    callback(new Error('请选择地区'))
  }
}

function portVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    value = [value]
  } else {
    if (!value[0]) callback(new Error('请填写'))
  }

  value.forEach(item => {
    item = parseInt(item, 10)
    if (item < 1 || item > 65535) {
      callback(new Error('端口范围为 1 - 65535'))
    }
  })
  callback()
}

const COMMON_RULE = {
  length_value: {
    validator: validatorNumber(1, 99999999999),
    trigger: 'blur',
    message: '数值有误'
  },
  length_value_zero: {
    validator: validatorNumber(0, 99999999999),
    trigger: 'blur',
    message: '数值有误'
  }
}

const FORM_TCP_TARGET_RULE = {
  ip: { type: 'array', required: true, trigger: 'blur', message: '请填写' },
  // ip: { validator: ipVaildate, trigger: 'blur' },
  regionTag: [
    {
      validator: validateRegion,
      trigger: 'blur'
    }
  ],
  // region: {},
  ip_type: { type: 'array', required: true, trigger: 'blur', message: '请选择' },
  tcp_ip_type: { type: 'array', required: true, trigger: 'blur', message: '请选择' },
  interval: [
    {
      validator: validatorNumber(1, 20),
      trigger: 'blur',
      message: '请求频率时间有误（为 1 - 20 秒）'
    }
  ],
  ip_rate_limit: {
    interval: {
      validator: validatorNumber(1, 20),
      trigger: 'blur',
      message: '请求频率时间有误（为 1 - 20 秒）'
    },
    reqs: { validator: validatorNumber(1, 1000), trigger: 'blur', message: '请求频率有误' }
  },
  ip_url_rate_limit: {
    interval: {
      validator: validatorNumber(1, 20),
      trigger: 'blur',
      message: '请求频率时间有误（为 1 - 20 秒）'
    },
    reqs: { validator: validatorNumber(1, 1000), trigger: 'blur', message: '请求频率有误' }
  },
  tcp_connection_type: { type: 'array', required: true, trigger: 'blur', message: '请选择' },
  tcp_new_connect: {
    reqs: {
      validator: validatorNumber(1, 9999999),
      trigger: 'blur',
      message: '数值有误'
    },
    interval: {
      validator: validatorNumber(1, 9999999),
      trigger: 'blur',
      message: '数值有误'
    }
  },
  tcp_packet_size: {
    size: {
      validator: validatorNumber(1, 9999999),
      trigger: 'blur',
      message: '数值有误'
    }
  },
  tcp_response_packet_size: {
    size: {
      validator: validatorNumber(1, 9999999),
      trigger: 'blur',
      message: '数值有误'
    }
  },
  tcp_service_port: {
    validator: portVaildate,
    trigger: 'blur'
  },
  tcp_total_connect: {
    total: {
      validator: validatorNumber(1, 9999999),
      trigger: 'blur',
      message: '数值有误'
    }
  }
}

export { FORM_TCP_TARGET_RULE, COMMON_RULE }
