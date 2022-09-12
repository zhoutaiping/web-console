import axios from 'axios'
import Interceptor, { BASE_URL } from '@/config/interceptor'

axios.defaults.timeout = 35000
axios.defaults.withCredentials = false

const resources = {
  MessageCenterResource: axios.create({
    baseURL: BASE_URL
  })
}

const interceptor = new Interceptor()

for (const key of Object.keys(resources)) {
  resources[key].interceptors.request.use(...interceptor.beforeRequest)
  resources[key].interceptors.response.use(...interceptor.afterResponse)
}

export const { MessageCenterResource } = resources
