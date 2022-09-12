const shell = require('shelljs')
const opn = require('opn')

async function main() {
  shell.exec('git push')
  const branch = shell.exec('git branch --show-current').stdout.trim()

  const patt = new RegExp('[[(STORY|ISSUE)]+-[0-9]*]*', 'gm')
  const store = branch.match(patt)
  if (store) {
    opn(`http://jira.lvluoyun.com:8081/browse/${store[0]}`)
  }
}

main()
