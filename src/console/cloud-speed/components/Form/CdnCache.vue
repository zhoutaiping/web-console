<template>
  <div>
    <template v-if="form.status === 'on'">
      <DmAlert>
        <p>1. 若您需配置的缓存类型不在我们的列表中，可以手动添加，以“|”分割</p>
        <p>2. 缓存类型为目录或者精确匹配时以 “／” 开头</p>
        <p>3. 支持自行调控优先级，不缓存记录优先级高于缓存记录</p>
        <p>4. 开启缓存功能后，系统默认忽略请求头中 Cache-Control 和 Pragma 两个头部不走缓存信息，只要节点有缓存就不会到源取数据，仍然返回缓存内容</p>
        <p>5. 缓存时间最长一年，缓存/不缓存分别能添加 200 条</p>
        <p>6. 游客缓存可以提升未登录用户的访问速度，若您的业务登录后用Cookie标识访客的，可对此Cookie键配置游客缓存，不包含此Cookie键的内容将被缓存</p>
      </DmAlert>
      <el-form label-position="top">
        <el-form-item>
          <TableCdnCache
            ref="TableCdnCache"
            v-model="form.status"
          >
            <div slot="action">
              <yd-form-radio-button
                v-if="isBatch"
                v-model="formBatch._policy"
                :radios="SELECT.EDIT_TYPE_M2"
              />
            </div>
          </TableCdnCache>
        </el-form-item>
        <el-form-item label="忽略请求头中 Cache-Control 和 Pragma">
          <yd-form-radio
            v-model="form.ctrl_f5_refresh"
            :radios="addReserved(SELECT.SWITCH_NUM_REVERSE, 'keep', isBatch)"
          />
        </el-form-item>
        <el-form-item label="缓存时忽略URL中的参数">
          <yd-form-radio
            v-model="form.ignore_args"
            :radios="addReserved(SELECT.SWITCH_NUM, 'keep', isBatch)"
          />
        </el-form-item>
        <el-form-item label="参数顺序识别">
          <yd-form-radio
            v-model="form.sort_args"
            :radios="addReserved(SELECT.SWITCH_NUM, 'keep', isBatch)"
          />
        </el-form-item>
        <el-form-item label="HTTP / HTTPS 缓存共用">
          <yd-form-radio
            v-model="form.ignore_scheme"
            :radios="addReserved(SELECT.SWITCH_NUM, 'keep', isBatch)"
          >HTTP / HTTPS 缓存共用</yd-form-radio>
        </el-form-item>
        <el-form-item label="遵循源站响应头部缓存规则">
          <yd-form-radio
            v-model="form.upstream_cache_control_first"
            :radios="addReserved(SELECT.SWITCH_NUM, 'keep', isBatch)"
          >遵循源站响应头部缓存规则</yd-form-radio>
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { addReserved } from '@/utils/form'
import TableCdnCache from './components/TableCdnCache'
import baseMixins from './base'
import SELECT from '../../constant/select'

export default {
  components: {
    TableCdnCache
  },

  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: SELECT.SWITCH_M2
      },
      formBatch: {
        _policy: 'append'
      },
      formDefault: {
        status: 'on',
        ctrl_f5_refresh: 0,
        ignore_args: 0,
        sort_args: 0,
        ignore_scheme: 0,
        upstream_cache_control_first: 0
      },
      formDefaultBatch: {
        status: 'keep',
        ctrl_f5_refresh: 'keep',
        ignore_args: 'keep',
        sort_args: 'keep',
        ignore_scheme: 'keep',
        upstream_cache_control_first: 'keep',
        cache_type: 'yes'
      },
      listRules: [],
      loadingSubmit: false
    }
  },

  methods: {
    setStatus(value) {
      this.form.status = value
      if (value === 'on') {
        this.$nextTick(() => {
          this.$refs.TableCdnCache.handleInit()
        })
      }
    },

    setForm(form = {}) {
      const { cdn_advance_cache = {}, cdn_advance_cache_rules = [] } = form
      this.form = {
        ...this.isBatch ? this.formDefaultBatch : this.formDefault,
        ...cdn_advance_cache
      }
      this.$nextTick(() => {
        this.$refs.TableCdnCache && this.$refs.TableCdnCache.handleInit()
        cdn_advance_cache_rules.length && this.$refs.TableCdnCache && this.$refs.TableCdnCache.setList(cdn_advance_cache_rules)
      })
    },

    async getForm() {
      const form = deepClone(this.form)
      form._policy = form.status
      const formData = {
        cdn_advance_cache: form
      }

      let listView = []
      let list = []
      if (this.$refs.TableCdnCache) {
        await this.$refs.TableCdnCache.handleCheck()
        listView = this.$refs.TableCdnCache.listView
        list = this.$refs.TableCdnCache.list
      }

      if (listView && listView.length > 0) {
        if (this.isBatch) {
          formData.cdn_advance_cache_rules = {
            ...this.formBatch,
            rules: listView,
            cache_type: listView[0].cache_type
          }
        } else {
          formData.cdn_advance_cache_rules = list
        }
      }

      return formData
    },

    initConfig() {
      this.$emit('initConfig', {
        selectStatus: addReserved(this.config.selectStatus, 'keep', this.isBatch)
      })
    }
  }
}
</script>
