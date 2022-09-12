const PACKAGE_LEVEL_MAP = {
  'HW010B': '基础版',
  'HW001B': '增强版',
  'HW002B': '专业版',
  'HW003B': '高级版',
  'HW005B': '尊享版',
  'HW080B': '商业版',
  'YD-WAFMFB': '免费版', // 1
  'WAFTYB-GD': '体验版', // 1
  'YD-WAFGJB': '高级版', // 2
  'YD-WAFGJB-GD': '高级版', // 2
  'YD-WAFSYB': '商业版',
  'YD-WAFSYB-GD': '商业版',
  'YD-WAFQJB': '旗舰版',
  'YD-WAFQJB-GD': '旗舰版',
  'YD-WAFDZB-GD': '定制版'
}

export default {
  PACKAGE_LEVEL_MAP,
  // 网站快照
  WebSnapshot: {
    'HW010B': false,
    'HW001B': false,
    'HW002B': true,
    'HW003B': true,
    'HW005B': true,
    'HW080B': true,
    'YD-WAFMFB': false,
    'YD-WAFTYB-GD': false,
    'YD-WAFGJB': true,
    'YD-WAFGJB-GD': true,
    'YD-WAFSYB': true,
    'YD-WAFSYB-GD': true,
    'YD-WAFQJB': true,
    'YD-WAFQJB-GD': true,
    'YD-WAFDZB-GD': true
  },
  // 云WAF
  WAF: {
    'HW010B': true,
    'HW001B': true,
    'HW002B': true,
    'HW003B': true,
    'HW005B': true,
    'HW080B': true,
    'YD-WAFMFB': false,
    'YD-WAFTYB-GD': false,
    'YD-WAFGJB': true,
    'YD-WAFGJB-GD': true,
    'YD-WAFSYB': true,
    'YD-WAFSYB-GD': true,
    'YD-WAFQJB': true,
    'YD-WAFQJB-GD': true,
    'YD-WAFDZB-GD': true
  },
  // 内容替换
  ContentReplace: {
    'HW010B': true,
    'HW001B': true,
    'HW002B': true,
    'HW003B': true,
    'HW005B': true,
    'HW080B': true,
    'YD-WAFMFB': false,
    'YD-WAFTYB-GD': false,
    'YD-WAFGJB': true,
    'YD-WAFGJB-GD': true,
    'YD-WAFSYB': true,
    'YD-WAFSYB-GD': true,
    'YD-WAFQJB': true,
    'YD-WAFQJB-GD': true,
    'YD-WAFDZB-GD': true
  },
  // WEB蜜网
  WebHoney: {
    'HW010B': false,
    'HW001B': false,
    'HW002B': false,
    'HW003B': true,
    'HW005B': true,
    'HW080B': true,
    'YD-WAFMFB': false,
    'YD-WAFTYB-GD': false,
    'YD-WAFGJB': false,
    'YD-WAFGJB-GD': false,
    'YD-WAFSYB': true,
    'YD-WAFSYB-GD': true,
    'YD-WAFQJB': true,
    'YD-WAFQJB-GD': true,
    'YD-WAFDZB-GD': true
  },
  // Bot
  Bot: {
    'HW010B': false,
    'HW001B': false,
    'HW002B': false,
    'HW003B': false,
    'HW005B': false,
    'HW080B': false,
    'YD-WAFMFB': false,
    'YD-WAFTYB-GD': false,
    'YD-WAFGJB': false,
    'YD-WAFGJB-GD': false,
    'YD-WAFSYB': false,
    'YD-WAFSYB-GD': false,
    'YD-WAFQJB': true,
    'YD-WAFQJB-GD': true,
    'YD-WAFDZB-GD': true
  },
  GuestAuth: {
    'HW010B': false,
    'HW001B': false,
    'HW002B': false,
    'HW003B': false,
    'HW005B': false,
    'HW080B': false,
    'YD-WAFMFB': false,
    'YD-WAFTYB-GD': false,
    'YD-WAFGJB': false,
    'YD-WAFGJB-GD': false,
    'YD-WAFSYB': true,
    'YD-WAFSYB-GD': true,
    'YD-WAFQJB': true,
    'YD-WAFQJB-GD': true,
    'YD-WAFDZB-GD': true
  }
}
