export default {
  stage: [
    {
      label: '全部',
      value: 'all'
    },
    {
      label: '滤前',
      value: 'rx'
    },
    {
      label: '滤后',
      value: 'tx'
    }
  ],
  protocol: [
    {
      label: '全部',
      value: ''
    },
    {
      label: 'TCP',
      value: 'tcp'
    },
    {
      label: 'UDP',
      value: 'udp'
    },
    {
      label: 'ICMP',
      value: 'icmp'
    },
    {
      label: 'OTHER',
      value: 'other'
    }
  ],
  sampleRatio: [
    {
      label: 1,
      value: 1
    },
    {
      label: 10,
      value: 10
    },
    {
      label: 100,
      value: 100
    },
    {
      label: 1000,
      value: 1000
    },
    {
      label: 10000,
      value: 10000
    }
  ],
  blackWhiteType: [
    {
      label: '全部黑名单',
      value: 'public_black'
    },
    {
      label: '全部白名单',
      value: 'public_white'
    },
    {
      label: '私有黑名单',
      value: 'private_black'
    },
    {
      label: '私有白名单',
      value: 'private_white'
    }
  ],
  level: [
    {
      label: 'SYN',
      value: -1
    },
    {
      label: '命中规则',
      value: -2
    },
    {
      label: '并发连接数异常',
      value: -3
    },
    {
      label: '新建连接速率异常',
      value: -4
    },
    {
      label: 'DNS请求速率异常',
      value: -5
    },
    {
      label: 'SYN报文速率比例异常',
      value: -6
    },
    {
      label: '僵尸网络攻击IP',
      value: -7
    }
  ],
  alarmType: [
    {
      label: '邮件',
      value: 'mail'
    },
    {
      label: '短信',
      value: 'sms'
    }
  ],
  disposalWay: [
    {
      label: '放行',
      value: 0
    },
    {
      label: '丢弃',
      value: 1
    },
    {
      label: '封禁',
      value: 3
    },
    {
      label: '限速',
      value: 4
    }
  ]
}
