import axios from 'axios'
import { BASE_URL } from '@/config/interceptor'

const specialFinanceResource = axios.create({
  baseURL: BASE_URL
})

specialFinanceResource.interceptors.request.use(config => config, error => Promise.reject(error))

specialFinanceResource.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export default {
  getApplyInfo: params =>
    specialFinanceResource.get('/V4/finance.invoice.applyInfo', {
      params: {
        ...params
      }
    })
}
