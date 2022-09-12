import request from '../service/request'

export default {
  plusPackageList(params) {
    return request({
      url: '/V4/Tjkd.plus.package.list',
      method: 'get',
      params
    })
  },

  plusOpLogExport(params) {
    return request({
      url: '/V4/Tjkd.plus.op.log.export',
      method: 'post',
      params
    })
  },

  plusForwardRuleList(params) {
    return request({
      url: '/V4/Tjkd.plus.forward.rule.list',
      method: 'get',
      params
    })
  },

  plusPackagePortList(params) {
    return request({
      url: '/V4/tjkd.plus.package.port.list',
      method: 'get',
      params
    })
  },

  plusPackageAll(params) {
    return request({
      url: '/V4/Tjkd.plus.package.all',
      method: 'get'
    })
  },

  appForwardRuleList(params) {
    return request({
      url: '/V4/tjkd.app.forward.rule.list',
      method: 'get',
      params
    })
  },

  appDomainList(params) {
    return request({
      url: '/V4/tjkd.app.domain.list',
      method: 'get',
      params
    })
  },

  appDomainAdd(data) {
    return request({
      url: '/V4/tjkd.app.domain.add',
      method: 'post',
      data
    })
  },
  // 批量添加域名规则
  appDomainBatchAdd(data) {
    return request({
      url: '/V4/tjkd.app.domain.batch.add',
      method: 'post',
      data
    })
  },

  appDomainInfo(params) {
    return request({
      url: '/V4/tjkd.app.domain.info',
      method: 'get',
      params
    })
  },

  appDomainBatchInfo(params) {
    return request({
      url: '/V4/tjkd.app.domain.batch.info',
      method: 'get',
      params
    })
  },

  appDomainEdit(data) {
    return request({
      url: '/V4/tjkd.app.domain.edit',
      method: 'post',
      data
    })
  },

  appDomainBatchEdit(data) {
    return request({
      url: '/V4/tjkd.app.domain.batch.edit',
      method: 'post',
      data
    })
  },

  appDomainDel(params) {
    return request({
      url: '/V4/tjkd.app.domain.del',
      method: 'delete',
      params
    })
  },

  plusPackageInfo(params) {
    return request({
      url: '/V4/tjkd.plus.package.info',
      method: 'get',
      params
    })
  }

  // plusPackagePortList: async function plusPackagePortList(params) {
  //   const data = await request({
  //     url: '/V4/tjkd.plus.package.port.list',
  //     method: 'get',
  //     params
  //   })

  //   const { data: listPort = [] } = data
  //   return listPort.map(parseInt)
  // }
}
