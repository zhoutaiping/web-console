import moment from 'moment'
export default {
  data() {
    return {
      meals: ['YD-WEBAQJS-TY', 'YD-WEBAQJS-GJ', 'YD-WEBAQJS-SY', 'YD-WEBAQJS-QJ', 'YD-WEBAQJS-DZ'],

      option: {
        btn_select: {
          0: [{ label: '购买', value: 'pay' }],
          1: [{ label: '续费', value: 'renew' }, { label: '扩容', value: 'kuorong' }, { label: '升级', value: 'up' }],
          2: [{ label: '续费', value: 'renew' }, { label: '扩容', value: 'kuorong' }, { label: '升级', value: 'up' }],
          3: [{ label: '续费', value: 'renew' }, { label: '扩容', value: 'kuorong' }],
          4: [{ label: '续费', value: 'renew' }, { label: '扩容', value: 'kuorong' }]
        },
        meals: [
          { label: '体验版', value: 'YD-WEBAQJS-TY', desc: 0 },
          { label: '高级版', value: 'YD-WEBAQJS-GJ', desc: 1 },
          { label: '商业版', value: 'YD-WEBAQJS-SY', desc: 2 },
          { label: '旗舰版', value: 'YD-WEBAQJS-QJ', desc: 3 },
          { label: '定制版', value: 'YD-WEBAQJS-DZ', desc: 4 }
        ]
      },
      times: [
        { label: '1个月', value: 1 },
        { label: '2个月', value: 2 },
        { label: '3个月', value: 3 },
        { label: '4个月', value: 4 },
        { label: '5个月', value: 5 },
        { label: '6个月', value: 6 },
        { label: '7个月', value: 7 },
        { label: '8个月', value: 8 },
        { label: '9个月', value: 9 },
        { label: '1年', value: 12 },
        { label: '2年', value: 24 },
        { label: '3年', value: 36 }
      ],
      payItemDesc: {
        0: [
          { label: '套餐版本：', value: '体验版' },
          { label: '防护域名包：', value: '不限制' },
          { label: '安全加速资源域：', value: '中国大陆' },
          { label: '安全加速节点数量：', value: '迷你型' },
          { label: '中国大陆带宽（边缘）：', value: '5 Mbps' },
          { label: '海外优化带宽（边缘）：', value: '不支持' },
          { label: '亚太CN2带宽（边缘）：', value: '不支持' },
          { label: '中国大陆带宽（中心）：', value: '不支持' },
          { label: '海外优化带宽（中心）：', value: '不支持' },
          { label: '网站快照：', value: '不支持' },
          { label: '精准访问控制：', value: '10 条/域名' }
        ],
        1: [
          { label: '套餐版本：', value: '高级版' },
          { label: '防护域名包：', value: '10', min: 1, step: 1, max: 100, key: 'domain_packet' },
          { label: '中国大陆带宽（边缘）：', value: '10 Mbps', min: 10, max: 10000, step: 50, key: 'mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（边缘）：', value: '10 Mbps', min: 10, max: 10000, step: 50, key: 'overseas_international_bandwidth', unit: ' Mbps' },
          { label: '亚太CN2带宽（边缘）：', value: '0 Mbps', min: 5, step: 5, max: 10000, key: 'overseas_china_acceleration_bandwidth', unit: ' Mbps' },
          { label: '中国大陆带宽（中心）：', value: '10 Mbps', min: 10, max: 10000, step: 50, key: 'mainland_china_mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（中心）：', value: '2 Mbps', min: 2, max: 10000, step: 5, key: 'mainland_china_overseas_bandwidth', unit: ' Mbps' },
          { label: '网站快照：', value: '10 G', min: 10, step: 10, max: 100, key: 'website_snapshot', unit: ' G' },
          { label: '精准访问控制：', value: '20 条/域名', min: 20, max: 1000, step: 100, key: 'fw_domain_rule_total', unit: ' 条/域名' }
        ],
        2: [
          { label: '套餐版本：', value: '商业版' },
          { label: '防护域名包：', value: '10', min: 1, step: 1, max: 100, key: 'domain_packet' },
          { label: '中国大陆带宽（边缘）：', value: '30 Mbps', min: 30, max: 10000, step: 50, key: 'mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（边缘）：', value: '30 Mbps', min: 30, max: 10000, step: 50, key: 'overseas_international_bandwidth', unit: ' Mbps' },
          { label: '亚太CN2带宽（边缘）：', value: '5 Mbps', min: 5, step: 5, max: 10000, key: 'overseas_china_acceleration_bandwidth', unit: ' Mbps' },
          { label: '中国大陆带宽（中心）：', value: '20 Mbps', min: 20, max: 10000, step: 50, key: 'mainland_china_mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（中心）：', value: '5 Mbps', min: 5, max: 10000, step: 5, key: 'mainland_china_overseas_bandwidth', unit: ' Mbps' },
          { label: '网站快照：', value: '10 G', min: 10, step: 10, max: 100, key: 'website_snapshot', unit: ' G' },
          { label: '精准访问控制：', value: '100 条/域名', min: 100, max: 1000, step: 100, key: 'fw_domain_rule_total', unit: ' 条/域名' }
        ],
        3: [
          { label: '套餐版本：', value: '旗舰版' },
          { label: '防护域名包：', value: '10', min: 1, step: 1, max: 100, key: 'domain_packet' },
          { label: '中国大陆带宽（边缘）：', value: '50 Mbps', min: 50, max: 10000, step: 50, key: 'mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（边缘）：', value: '50 Mbps', min: 50, max: 10000, step: 50, key: 'overseas_international_bandwidth', unit: ' Mbps' },
          { label: '亚太CN2带宽（边缘）：', value: '10 Mbps', min: 10, max: 10000, step: 5, key: 'overseas_china_acceleration_bandwidth', unit: ' Mbps' },
          { label: '中国大陆带宽（中心）：', value: '50 Mbps', min: 50, max: 10000, step: 50, key: 'mainland_china_mainland_china_bandwidth', unit: ' Mbps' },
          { label: '海外优化带宽（中心）：', value: '10 Mbps', min: 10, max: 10000, step: 5, key: 'mainland_china_overseas_bandwidth', unit: ' Mbps' },
          { label: '网站快照：', value: '10 G', min: 10, step: 10, max: 100, key: 'website_snapshot', unit: ' G' },
          { label: '精准访问控制：', value: '200 条/域名', min: 200, max: 1000, step: 100, key: 'fw_domain_rule_total', unit: ' 条/域名' }
        ],
        4: [
          { label: '套餐版本：', value: '定制版' },
          { label: '防护域名包：', value: '按需' },
          { label: '安全加速资源域：', value: '按需' },
          { label: '安全加速节点数量：', value: '按需' },
          { label: '中国大陆带宽（边缘）：', value: '按需' },
          { label: '海外优化带宽（边缘）：', value: '按需' },
          { label: '亚太CN2带宽（边缘）：', value: '按需' },
          { label: '中国大陆带宽（中心）：', value: '按需' },
          { label: '海外优化带宽（中心）：', value: '按需' },
          { label: '网站快照：', value: '支持（存储容量按需）' },
          { label: '精准访问控制：', value: '按需' }
        ]

      }
    }
  },

  methods: {
    findIndex(data = {}, flag = '') {
      let val = 0
      if (data && Object.keys(data).length) {
        val = this.meals.findIndex(i => { return i === flag })
      }
      return val
    },

    upMeal(flag) {
      const list = JSON.parse(JSON.stringify(this.option.meals))
      const up_meal = []
      const index = this.findIndex(this.data, this.data.meal_flag)
      if (index > -1) {
        list.forEach((i, key) => {
          if (key > index && key < 4) {
            up_meal.push(i)
          }
        })
      }
      return up_meal
    },

    setkuorong() {
      const index = this.findIndex(this.data, this.data.meal_flag)
      this.index = index > -1 && index || 0
      const desc = this.payItemDesc[index]
      if (desc && desc.length > 0) {
        this.kuorong = desc
        desc.forEach(item => {
          if (item.key && item.key !== '') {
            this.$set(this.kuorong_form, item.key, 0)
            this.rules[item.key] = []
          }
        })
      }
    },

    changeKuorong(val, key, beishu, min) {
      if (val > min) {
        const value = Math.ceil(val / beishu) * beishu
        this.kuorong_form[key] = value
      }
      this.getPrice()
    },

    // 计算剩余 天、时、分、秒
    CountDown(datetime, d) {
      // 求时间差：
      const date1 = moment(new Date()) // 开始时间
      const date2 = moment(datetime) // 结束时间
      const date3 = Number(date2 - date1) // 时间差的毫秒数
      // 计算出相差天数
      const days = Math.floor(date3 / (24 * 3600 * 1000))

      // 计算出小时数

      const leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      const hours = Math.floor(leave1 / (3600 * 1000))
      // 计算相差分钟数
      const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      const minutes = Math.floor(leave2 / (60 * 1000))

      // 计算相差秒数
      const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      const seconds = Math.round(leave3 / 1000)

      const dayStr = days >= 0 ? Number(days) + '天 ' : '过期' + Math.abs(Number(days)) + '天 '
      const hoursStr = hours >= 0 ? Number(hours) + '小时 ' : Math.abs(Number(hours)) + '小时 '
      const minutesStr = minutes >= 0 ? Number(minutes) + '分钟 ' : Math.abs(Number(minutes)) + '分钟 '
      const secondsStr = seconds >= 0 ? Number(seconds) + '秒 ' : Math.abs(Number(seconds)) + '秒 '

      const leftTime = dayStr + hoursStr + minutesStr + secondsStr
      return leftTime
    }

  }
}
