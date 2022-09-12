export default {
  DomainNode: {
    name: '域名节点状态',
    desc: '批量修改网站域名节点状态'
  },

  Source: {
    name: '源站设置',
    desc: '指定回源地址和监听端口，支持回源到IP及域名'
  },

  CdnCache: {
    name: '高级缓存',
    desc: '__companyEN__优质节点网络，智能缓存网站内容极大提高网站访问速度'
  },

  WebP: {
    name: 'WebP自适应',
    desc: '性能优化智能判断浏览器是否支持 WebP，来决定返回 WebP 格式图片还是原图，从而减少网络传输消耗，优化图片渲染速度。此功能需要相应的资源启用了缓存'
  },

  CloudWAF: {
    key: 'CloudWAF',
    apiKey: 'cloud_waf',
    title: '漏洞攻击防护',
    desc: '基于大数据人工智能攻击识别引擎，可防御SQL注入、XSS攻击、恶意扫描等各种漏洞攻击同时通过访客行为和安全大数据分析，深层次拦截WebShell'
  },

  WebHoney: {
    key: 'WebHoney',
    apiKey: 'web_honeypot',
    title: 'Web蜜网',
    desc: '依多年攻防实战经验，推出了针对高风险攻击者使用的工具及其攻击手法的诱捕技术，同时支持多种实施部署方案'
  },

  WafIntercept: {
    key: 'WafIntercept',
    apiKey: 'waf_block_diy_page',
    title: 'WAF拦截页面定制',
    desc: '定制专属WAF拦截页面，不开启是默认使用Web应用防火墙提供的拦截页面'
  },

  WebSnapshot: {
    key: 'WebSnapshot',
    apiKey: 'safe_snap',
    title: '网站快照',
    desc: '分区域、分时间对外提供快照访问控制，强烈建议在敏感时期启用网站快照访问控制，可100%保障内容安全。'
  },

  ContentReplace: {
    key: 'ContentReplace',
    apiKey: 'content_replace',
    title: '内容替换',
    desc: '过滤和替换敏感信息、反动言论和淫秽内容。'
  },

  DefenseRefer: {
    key: 'DefenseRefer',
    apiKey: 'anti_refer',
    title: '防盗链',
    desc: '保护系统资源不被外部盗用'
  },

  ZoneLimit: {
    key: 'ZoneLimit',
    apiKey: 'zone_limit',
    title: '区域屏蔽',
    desc: '可根据业务需求，允许或禁止特定区域的终端用户对网站资源的访问'
  },

  DefenseCC: {
    key: 'DefenseCC',
    apiKey: 'anti_cc',
    title: '防CC',
    desc: '有效防止CC攻击，YUNDUN全局默认对搜索引擎放行'
  },

  WAF: {
    key: 'WAF',
    apiKey: 'firewall',
    title: '精准化访问控制',
    desc: '针对七层提供精准化访问控制台，可以根据业务情况定制专有防护策略，绑定业务后将覆盖对应业务所有“自定义”类型规则集'
  },

  BackSourceSni: {
    key: 'BackSourceSni',
    apiKey: 'back_source_sni'
  }
}
