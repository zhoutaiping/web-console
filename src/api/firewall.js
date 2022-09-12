import request from '../service/request'

async function requestFilter(req, filter) {
  const data = await req
  return filter(data)
}

export default {
  firewallNumberTransfer: function firewallNumberTransfer() {
    return request({
      url: '/V4/firewall.member.transfer',
      method: 'get'
    })
  },
  // 获取域名下的策略
  firewallPolicyStatsDomainid: function firewallPolicyStatsDomainid(params) {
    return request({
      url: '/V4/firewall.policy.stats_domainid',
      method: 'get',
      params
    })
  },
  // 获取域名下的策略
  firewallPolicyGetDomainid: function firewallPolicyGetDomainid(params) {
    return request({
      url: '/V4/firewall.policy.get_domainid',
      method: 'get',
      params
    })
  },
  // 获取页面配置
  firewallPagecfg: function firewallPagecfg(type) {
    return request({
      url: '/V4/firewall.pagecfg',
      method: 'get',
      params: { type }
    })
  },
  // 根据ID获取策略
  firewallPolicyGetid: function firewallPolicyGetid(id) {
    return request({
      url: '/V4/firewall.policy.get_id',
      method: 'get',
      params: { id }
    })
  },
  // 根据ID获取策略记录
  firewallPolicyGetMainid: function firewallPolicyGetMainid(mainid) {
    return request({
      url: '/V4/firewall.policy.get_mainid',
      method: 'get',
      params: { mainid, per_page: 1000 }
    })
  },
  // 根据CODE获取策略记录
  policyGetcode: function policyGetcode(code) {
    return request({
      url: '/V4/firewall.policy.get_code',
      method: 'get',
      params: { code }
    })
  },
  // 暂停策略
  firewallPolicyStop: function firewallPolicyStop(ids) {
    return request({
      url: '/V4/firewall.policy.stop',
      method: 'post',
      data: { ids }
    })
  },
  // 打开策略
  firewallPolicyOpen: function firewallPolicyOpen(ids) {
    return request({
      url: '/V4/firewall.policy.open',
      method: 'post',
      data: { ids }
    })
  },
  // 删除策略
  firewallPolicyDelete: function firewallPolicyDelete(ids) {
    return request({
      url: '/V4/firewall.policy.delete',
      method: 'post',
      data: { ids }
    })
  },
  // 关闭策略
  firewallPolicyClose: function firewallPolicyClose(ids) {
    return request({
      url: '/V4/firewall.policy.close',
      method: 'post',
      data: { ids }
    })
  },
  // 保存策略
  firewallPolicySave: function firewallPolicySave(data) {
    return request({
      url: '/V4/firewall.policy.save',
      method: 'post',
      data
    })
  },
  // 策略排序
  firewallPolicySort: function firewallPolicySort(new_sorts) {
    return request({
      url: '/V4/firewall.policy.sort',
      method: 'post',
      data: { new_sorts }
    })
  },
  // 操作日志
  firewallOplog: function firewallOplog(params) {
    const { bank } = params
    if (bank === 'website') delete params.bank
    return request({
      url: '/V4/firewall.oplog',
      method: 'get',
      params
    })
  },
  // 七层报表
  reportBlockList: function reportBlockList(params) {
    const { type } = params
    const url =
      type === 'firewall'
        ? '/V4/firewall.report.block.list'
        : '/V4/firewall.report.package.block.list'

    return request({
      url,
      method: 'get',
      params
    })
  },

  reportBlockDetails: function reportBlockDetails(params) {
    const { type } = params
    const url =
      type === 'firewall'
        ? '/V4/firewall.report.block.details'
        : '/V4/firewall.report.package.block.details'

    return request({
      url,
      method: 'get',
      params
    })
  },
  // 四层报表
  reportPakcageBlockList: function reportPakcageBlockList(params) {
    return request({
      url: '/V4/firewall.report.package.block.list',
      method: 'get',
      params
    })
  },

  reportPakcageBlockDetails: function reportPakcageBlockDetails(params) {
    return request({
      url: '/V4/firewall.report.package.block.details',
      method: 'get',
      params
    })
  },
  // 获取套餐下的策略
  policyGetpackageid: function policyGetpackageid(params) {
    return requestFilter(
      request({
        url: '/V4/firewall.policy.get_packageid',
        method: 'get',
        params
      }),
      data => {
        const { list = [] } = data
        list.forEach(item => {
          const { rules = [] } = item
          rules.forEach(rule => {
            const { rule_type } = rule
            if (rule_type === 'tcp_service_port') {
              rule.data = rule.data.map(String)
            }
          })
        })

        return data
      }
    )
  },

  openExport: function openExport(params) {
    return request({
      url: '/V4/firewall.oplog.export',
      method: 'post',
      params
    })
  }
}
