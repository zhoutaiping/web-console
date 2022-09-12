const Axios = require('axios')
const https = require('https')

const Service = Axios.create({
  baseURL: 'https://git.nodevops.cn/api/v4/',
  timeout: 30000,
  headers: {
    'PRIVATE-TOKEN': 'CYgf1jxyMxB4zhjugFCD'
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

function fetchAlert(data) {
  Axios({
    url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send',
    method: 'POST',
    params: { key: '859b2af2-a039-4b95-b6f1-a704ccb81b04' },
    data
  })
}

async function createMergeRequest(PROJECT_ID, data) {
  let response
  try {
    response = await Service({
      url: `/projects/${PROJECT_ID}/merge_requests`,
      method: 'POST',
      data
    })
  } catch (e) {
    console.log(e.response.data)
    throw new Error(e.response.data)
  }

  return response.data
}

async function fetchProjectById(id) {
  let response
  try {
    response = await Service({
      url: `/projects/${id}`,
      method: 'GET'
    })
  } catch (e) {
    throw new Error(e.response.data)
  }

  return response.data
}

async function fetchProjectVariablesById(id) {
  let response
  try {
    response = await Service({
      url: `/projects/${id}/variables`,
      method: 'GET'
    })
  } catch (e) {
    throw new Error(e.response.data)
  }

  return response.data
}

async function start() {
  const [, , PROJECT_ID, CI_COMMIT_SHORT_SHA, CI_COMMIT_TAG] = process.argv

  const title = CI_COMMIT_TAG
  const data = {
    title,
    source_branch: `release_${CI_COMMIT_SHORT_SHA}`,
    target_branch: 'master'
  }
  const projectInfo = await fetchProjectById(PROJECT_ID)

  const varList = await fetchProjectVariablesById(PROJECT_ID)
  const vars = {}
  varList.forEach(item => {
    vars[item.key] = item.value
  })
  const BUNDLE_ID = vars.BUNDLE_ID

  const resMR = await createMergeRequest(BUNDLE_ID, data)

  let content = '发布审批'
  content += `\n> 项目：${projectInfo.description}\n版本：${title}\n`
  content += `[进入审核](http://devops.test.nodevops.cn/#/?merge_request_iid=${resMR.iid}&project_id=${PROJECT_ID})`
  fetchAlert(
    {
      msgtype: 'markdown',
      markdown: {
        content
      }
    }
  )
}

start()
