import request from '../service/request-raw'
import qs from 'qs'

const API_URL = 'V4/ads.api'

export default {
  post(api, data, params) {
    return request({
      url: API_URL,
      method: 'POST',
      data: {
        api,
        data,
        method: 'POST'
      }
    })
  },
  get(api, data) {
    return request({
      url: API_URL,
      method: 'POST',
      data: {
        api: `${api}?${qs.stringify(data)}`,
        method: 'GET'
      }
    })
  },
  put(api, data) {
    return request({
      url: API_URL,
      method: 'POST',
      data: {
        api,
        data,
        method: 'PUT'
      }
    })
  },
  delete(api, data) {
    return request({
      url: API_URL,
      method: 'POST',
      data: {
        api,
        data,
        method: 'DELETE'
      }
    })
  }
}
