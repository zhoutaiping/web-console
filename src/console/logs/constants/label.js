import Fetch from '@/api/fetch'

const STATUS_NOT_STARTED = 0
const STATUS_PROGRESS = 1
const STATUS_COMPLETE = 2
const STATUS_FAIL = 3
const STATUS_CANCELLED = 4

const label = {
  status_var: {
    STATUS_NOT_STARTED,
    STATUS_PROGRESS,
    STATUS_COMPLETE,
    STATUS_FAIL,
    STATUS_CANCELLED
  },
  file_type: [
    // {
    //   label: 'XLS',
    //   value: 'xls'
    // },
    {
      label: 'CSV',
      value: 'csv'
    },
    {
      label: 'JSON',
      value: 'json'
    }
  ],
  data_source: [],
  status: [
    {
      label: '未开始',
      value: STATUS_NOT_STARTED,
      color: 'warning'
    },
    {
      label: '进行中',
      value: STATUS_PROGRESS,
      color: 'primary'
    },
    {
      label: '已完成',
      value: STATUS_COMPLETE,
      color: 'success'
    },
    {
      label: '失败',
      value: STATUS_FAIL,
      color: 'danger'
    },
    {
      label: '已取消',
      value: STATUS_CANCELLED,
      color: 'danger'
    }
  ]
}

export default label

export async function fetchFields() {
  const res = await Fetch.get('V4/soc.log.download.fields')
  delete res._status
  const data_source = []
  Object.keys(res).forEach(key => {
    const item = res[key]
    data_source.push({
      value: key,
      label: item.name
    })
  })
  label.data_source = data_source
  return label
}
