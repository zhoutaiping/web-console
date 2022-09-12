import request from '../service/request'

export default {
  allDomains: function allDomains(params) {
    return request({
      url: '/V4/Web.All.Domains',
      method: 'get',
      params
    })
  },

  batchCalList(data) {
    return request({
      url: '/V4/Web.Domain.batch.ca.list',
      method: 'post',
      data
    })
  }
}
