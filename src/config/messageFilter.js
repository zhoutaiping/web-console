import Config from '@/core/setup-config'

const FILTER = [
  ['开启TCP安全加速套餐才可以添加非标端口', '暂不支持非标端口'],
  ['开启太极抗D-Plus套餐才可以添加非标端口', '暂不支持非标端口']
]

if (Config.name === 'wofang') {
  FILTER.push(['Web应用防火墙', '网站卫士'])
}

function messageFilter(message) {
  FILTER.forEach(item => {
    const [reg, text] = item
    const re = new RegExp(reg, 'gim')
    message = message.replace(reg, text)
  })
  return message
}

export { messageFilter }
