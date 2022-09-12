import request from '../service/request'

export default {
  hwwsPackageList: function hwwsPackageList(params) {
    return request({
      url: '/V4/cloudsafe.hwws.package.list',
      method: 'get',
      params
    })
  }
}
