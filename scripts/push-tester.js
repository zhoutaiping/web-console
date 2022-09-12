const Gitlab = require('gitlab-sdk-nodejs')
const shell = require('shelljs')

const Client = new Gitlab({
  serverUrl: 'https://git.nodevops.cn',
  productId: 'frontend-team%2Fconsole-v5-web',
  token: 'CYgf1jxyMxB4zhjugFCD'
})

async function main() {
  shell.exec('git push')
  const branch = shell.exec('git branch --show-current').stdout.trim()
  let res
  try {
    res = await Client.createMergeRequests({
      source_branch: branch,
      target_branch: 'tester',
      title: `merge ${branch}`
    })
  } catch (e) {
    console.log(e)
  }
  console.log(res)
  await Client.mergeMergeRequests(res.iid)
}

main()
