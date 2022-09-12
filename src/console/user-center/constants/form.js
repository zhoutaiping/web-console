const FORM_IP = {
  content: '',
  loading: false
}

const USER_SAFE_CLOSE_QA = {
  qs_flag: 'father_name',
  qs_answer: ''
}

const USER_SAFE_REST_QA = {
  token: '',
  cap: '',
  answer: [
    {
      name: 'father_name',
      value: ''
    },
    {
      name: 'mother_name',
      value: ''
    },
    {
      name: 'wife_name',
      value: ''
    }
  ]
}

const USER_SAFE_ZONE = {
  country: 'CN',
  province: '',
  areaList: [],
  content: '',
  loading: false
}

const FORM_SAFE = {
  cap: '',
  answer: [
    {
      name: 'father_name',
      value: ''
    },
    {
      name: 'mother_name',
      value: ''
    },
    {
      name: 'wife_name',
      value: ''
    }
  ]
}

export { FORM_IP, USER_SAFE_ZONE, FORM_SAFE, USER_SAFE_REST_QA, USER_SAFE_CLOSE_QA }
