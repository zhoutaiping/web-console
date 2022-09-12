import axios from 'axios'
import Interceptor, { BASE_URL } from '@/config/interceptor'

axios.defaults.timeout = 35000
axios.defaults.withCredentials = false
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const resources = {
  SourceUserResource: axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }),
  TaichiPlusResource: axios.create({
    baseURL: BASE_URL
  })
}

const interceptor = new Interceptor({ progress: false })

for (const key of Object.keys(resources)) {
  resources[key].interceptors.request.use(...interceptor.beforeRequest)
  // resources[key].interceptors.response.use(
  //   ...interceptor.afterResponse
  // )
}

export const { SourceUserResource, TaichiPlusResource } = resources
