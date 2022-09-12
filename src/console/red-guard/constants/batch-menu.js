import ConfigItem from './config-item'

export default [
  {
    title: '应用安全',
    items: [
      ConfigItem.CloudWAF,
      ConfigItem.WebHoney,
      ConfigItem.WafIntercept
    ]
  },
  {
    title: '内容安全',
    items: [
      ConfigItem.WebSnapshot,
      ConfigItem.ContentReplace
    ]
  },
  {
    title: '业务安全',
    items: [
      ConfigItem.DefenseRefer,
      ConfigItem.ZoneLimit,
      ConfigItem.DefenseCC,
      ConfigItem.WAF
    ]
  }
]
