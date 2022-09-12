<template>
  <div>
    <template v-if="(dataView.status === 'off' || !dataView.status) && !items.length">
      未启用
    </template>
    <template v-else>
      <template v-if="items.length">
        <div
          v-for="(item, index) in items"
          :key="index"
        >
          <template v-if="item.title">
            {{ item.title }}：
          </template>
          <template v-if="item.component">
            <component
              :is="item.component"
              v-model="item.valueView"
            />
          </template>
          <template v-else>
            {{ item.valueView }}
          </template>
        </div>
      </template>
      <template v-else>
        启用
      </template>
    </template>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { labelView } from '@/utils/filter'
import ColumnListMore from '@/components/Column/ColumnListMore'
import Label from '../../../constant/label'
import SELECT from '../../../constant/select'

const KEYS_MAP = {
  waf_mode: {
    title: '防护模式',
    origin: Label.WAF_MODE
  },
  waf_level: {
    title: '防护等级',
    origin: Label.WAF_LEVEL
  },
  ai_status: {
    title: 'AI引擎',
    origin: Label.STATUS_SWITCH
  },
  mode: {
    title: '模式'
  },
  type: {
    title: '类型'
  },
  time_control_flag: {
    title: '访问控制时间'
  },
  policys: {
    title: '规则'
  }
}

const KEY_MAP_CUSTOM = {
  Page404: {
    type: {
      title: '类型',
      origin: SELECT.PAGE_404
    }
  },
  Page500: {
    type: {
      title: '类型',
      origin: SELECT.PAGE_500
    }
  },
  Page502: {
    type: {
      title: '类型',
      origin: SELECT.PAGE_500
    }
  },
  WafIntercept: {
    type: {
      title: '类型',
      origin: Label.WAF_INTERCEPT_TYPE
    },
    content: {
      title: '内容'
    }
  },
  WebHoney: {
    server: {
      title: 'Web蜜网服务器'
    },
    success_url: {
      title: '入侵成功URL'
    },
    type: {
      title: '类型',
      origin: Label.WEB_HONEY_STATUS
    },
    custom_type: {
      title: '诱导类型',
      origin: Label.WEB_HONEY_CUSTOM_TYPE
    }
  },
  ContentReplace: {
    mode: {
      title: '模式',
      origin: Label.CONTENT_REPLACE_MODE
    },
    diy_words: {
      title: '自定义敏感词',
      component: 'ColumnListMore'
    },
    replace_to: {
      title: '敏感词替换为'
    }
  },
  // BackSourceSni: {
  //   back_source_sni: [
  //     {
  //       label: 'OFF',
  //       value: 'off'
  //     },
  //     {
  //       label: '自定义',
  //       value: 'diy'
  //     }
  //   ]
  // },
  WebSnapshot: {
    backup_content: {
      title: '备份内容',
      origin: Label.BACKUPS_TYPE
    },
    regular_update: {
      title: '每日定时更新',
      origin: Label.STATUS_SWITCH_NUMBER
    },
    zone_mode: {
      title: '区域模式',
      origin: Label.WEB_SNAPSHOT_ZONE_MODE
    },
    use_time_mode: {
      title: '快照使用时间',
      origin: Label.WEB_SNAPSHOT_TIME_MODE
    },
    whiteList: {
      title: '白名单',
      component: 'ColumnListMore'
    },
    blackList: {
      title: '黑名单',
      component: 'ColumnListMore'
    },
    time_control: {
      title: '访问控制时间'
    }
  },
  DefenseRefer: {
    mode: {
      title: '防盗链设置',
      origin: Label.DEFENSE_REFER_MODE
    },
    whiteList: {
      title: '白名单',
      component: 'ColumnListMore'
    },
    blackList: {
      title: '黑名单',
      component: 'ColumnListMore'
    }
  },
  ZoneLimit: {
    mode: {
      title: '模式',
      origin: Label.ZONE_LIMIT_MODE
    },
    whiteList: {
      title: '白名单',
      component: 'ColumnListMore'
    },
    blackList: {
      title: '黑名单',
      component: 'ColumnListMore'
    },
    time_control: {
      title: '访问控制时间'
    }
  },
  DefenseCC: {
    type: {
      title: '状态',
      origin: Label.DEFENSE_CC_STATUS
    }
  }
}

export default {
  components: { ColumnListMore },

  props: {
    row: Object,
    data: {
      type: [Object, Array],
      default: function() {
        return {}
      }
    },
    setForm: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },

  data() {
    return {
      items: [],
      Label,
      dataView: {}
    }
  },

  watch: {
    data(val) {
      this.initView()
    }
  },

  mounted() {
    this.initView()
  },

  methods: {
    initView() {
      this.dataView = deepClone(this.data)
      const { name } = this.row
      if (['Source', 'Page500', 'Page502', 'Page404', 'WafIntercept', 'ContentReplace', 'DefenseCC', 'DefenseRefer', 'WebHoney', 'ZoneLimit'].includes(name)) {
        KEY_MAP_CUSTOM[name] && this.initCommon(KEY_MAP_CUSTOM[name])
        this.initFeature(name, this.dataView)
      } else if (['BackSourceSni'].includes(name)) {
        this.dataView.status = this.dataView.back_source_sni
      } else {
        this.initCommon(KEYS_MAP)
      }
    },

    initCommon(KEYS_MAP) {
      const items = []
      Object.keys(this.dataView).forEach(key => {
        const itemConfig = KEYS_MAP[key]
        if (!itemConfig) return
        const value = this.dataView[key]

        let valueView = value
        if (typeof value !== 'object' && itemConfig.origin) {
          valueView = labelView(value, this.envSelects(itemConfig.origin))
        }

        if (key === 'policys') {
          valueView = `${value.length}条`
        } else if (key === 'whiteList' || key === 'blackList') {
          valueView = value.map(_ => {
            if (_.zone_name) {
              return _.zone_name
            } else {
              return _
            }
          })
        } else if (key === 'time_control') {
          if (!value.weeks) return
          const weeksView = value.weeks.map(_ => labelView(_, Label.WEEKS))
          valueView = `星期：${weeksView}；时间：${value.startTime} - ${value.endTime}`
        }

        items.push({
          title: itemConfig.title,
          key,
          value,
          valueView,
          component: itemConfig.component
        })
      })
      this.items = items
    },

    initFeature(key, data) {
      if (key === 'ContentReplace') {
        if (['default'].includes(data.mode)) {
          this.items = this.items.filter(_ => ['status', 'mode'].includes(_.key))
        }

        if (data.status === 'off') {
          this.items = []
        }
      } else if (key === 'WebSnapshot') {
        const showList = ['status', 'zone_mode', 'use_time_mode', 'backup_content', 'regular_update']
        if (['white', 'black'].includes(data.zone_mode)) showList.push(`${data.zone_mode}List`)
        if (data.use_time_mode === 'custom') showList.push('time_control')
        const items = [
          {
            title: '状态',
            valueView: labelView(data.status, Label.STATUS_SWITCH)
          }
        ]
        this.items = items.concat(this.items.filter(_ => showList.includes(_.key)))
        data.status = 'on'
      } else if (key === 'WebHoney') {
        const showList = ['type']
        if (data.type === 'custom') {
          showList.push('custom_type', 'server', 'success_url')
        }
        if (data.type === 'default') {
          showList.push('menu')
          this.items.push({
            title: '目录',
            key: 'menu',
            valueView: this.setForm.web_honeypot_rules.map(_ => _.menu),
            component: 'ColumnListMore'
          })
        }

        this.items = this.items.filter(_ => showList.includes(_.key))
      } else if (key === 'Source') {
        this.items = [
          {
            valueView: this.data.listen_port ? '已启用' : '未启用'
          }
        ]
      }
    }
  }
}
</script>
