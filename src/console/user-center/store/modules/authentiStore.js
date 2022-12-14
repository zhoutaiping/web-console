import authenticateAction from '../actions/authenticateAction'
import authenticateMutation from '../mutations/authenticateMutation'

const state = {
  status: '',
  type: '',
  reason: '',
  area: '',
  msgtip: [],
  info: {
    personal: {
      personal_name: '',
      personal_mobile: '',
      personal_pic: '',
      personal_pic_negative: '',
      personal_number: ''
    },
    company: {
      company_name: '',
      company_tyshxy_card: '',
      company_yyzz_pic: '',
      company_concat_name: '',
      company_concat_mobile: ''
    },
    government: {
      organization_name: '',
      organization_code: '',
      charge_man_name: '',
      office_phone: '',
      organization_address: '',
      organization_certificate_pic: '',
      contact_mobile: '',
      contact_qq: '',
      contact_name: ''
    }
  }
}

export default {
  state,
  actions: authenticateAction,
  mutations: authenticateMutation
}
