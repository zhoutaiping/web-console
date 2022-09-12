const label = {
  scanStatus: [
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
  ],
  monitorStatus: [
    {
      label: '开启',
      value: true,
      color: 'success'
    },
    {
      label: '关闭',
      value: false,
      color: 'danger'
    }
  ],

  scan_pattern: [
    {
      label: '快速',
      value: 1
    },
    {
      label: '标准',
      value: 2
    },
    {
      label: '全面',
      value: 3
    }
  ],

  contentSafe: {
    risk_type: [
      {
        label: '篡改',
        value: 'tamper'
      },
      {
        label: '敏感词',
        value: 'sensitiveWord'
      },
      {
        label: '关键词',
        value: 'keyword'
      },
      {
        label: '异常状态码',
        value: 'statusCode'
      },
      {
        label: '恶意链接',
        value: 'darkChain'
      },
      {
        label: '风险外链',
        value: 'outerInspect'
      }
    ],
    // 监测页面
    detection_page: [
      {
        label: '首页',
        value: 1
      },
      {
        label: '全站',
        value: 2
      },
      {
        label: '自定义',
        value: 3
      }
    ],
    // 监测模式
    detection_pattern: [
      {
        label: '快速',
        value: 1
      },
      {
        label: '标准',
        value: 2
      },
      {
        label: '全面',
        value: 3
      }
    ]
  }
}

const state = {
  label
}

export default {
  state
}
