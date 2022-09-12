import * as types from '../mutation-type/authentication'
import SourceUserResource from '../../assets/js/resource/SourceUserResource'
import { Message } from 'element-ui'

export default {
  getBasicinfo({ commit }) {
    SourceUserResource.getCertificationInfo().then(response => {
      const { data, status } = response.data
      if (status.code === 16161) {
        data.status = 0
      } else if (status.code === 1) {
        const certification_type = Number(data.certification_type)
        data.type = certification_type
        const check_status = Number(data.check_status)
        data.status = check_status
        data.area = Number(data.area)
        // 单状态判断
        switch (certification_type) {
          case 1:
            commit(types.GET_PERSONALINFO, data.personal_info)
            break
          case 2:
            commit(types.GET_COMPANYINFO, data.company_info)
            break
          case 3:
            commit(types.GET_GOVERNMENTINFO, data.government_info)
            break
          default:
            commit(types.GET_PERSONALINFO, data.personal_info)
        }
        // 升级状态判断（后端会返回个人和升级对应类型的数据 所以需要筛选获取）
        if (check_status === 4) { commit(types.GET_COMPANYINFO, response.data.data.company_info) } else if (check_status === 7) { commit(types.GET_GOVERNMENTINFO, response.data.data.government_info) }
      } else {
        Message.error(status.message)
      }
      commit(types.GET_BASICINFO, data)
    })
  }
}
