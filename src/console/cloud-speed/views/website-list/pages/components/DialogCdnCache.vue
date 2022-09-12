<template>
  <yd-dialog
    v-loading
    :class="b()"
    :title="title"
    :visible.sync="open"
    :close-on-click-modal="true"
    aside
    aside-type="top"
  >
    <div>
      <FormItemAction>
        {{ appAssets.companyEN }} 优质节点网络，智能缓存网站内容极大提高网站访问速度
        <div slot="action">
          <yd-form-select
            :loading="loadingSubmit"
            v-model="form.status"
            :selects="addReserved(SELECT.SWITCH_M2, 'keep')"
            @change="handleStatusChange"
          />
        </div>
      </FormItemAction>
      <yd-alert>
        <p>1. 若您需配置的缓存类型不在我们的列表中，可以手动添加，以“|”分割</p>
        <p>2. 缓存类型为目录或者精确匹配时以 “／” 开头</p>
        <p>3. 支持自行调控优先级，不缓存记录优先级高于缓存记录</p>
        <p>4. 开启缓存功能后，系统默认忽略请求头中 Cache-Control 和 Pragma 两个头部不走缓存信息，只要节点有缓存就不会到源取数据，仍然返回缓存内容</p>
        <p>5. 缓存时间最长一年，缓存/不缓存分别能添加 200 条</p>
        <p>6. 游客缓存可以提升未登录用户的访问速度，若您的业务登录后用Cookie标识访客的，可对此Cookie键配置游客缓存，不包含此Cookie键的内容将被缓存</p>
      </yd-alert>
      <el-form label-position="top">
        <el-form-item>
          <yd-table :open-min-height="false">
            <TableCdnCache
              ref="list"
              v-model="form.status"
            >
              <div slot="action">
                <yd-form-radio-button
                  v-model="psource"
                  :radios="SELECT.EDIT_TYPE_M2"
                />
              </div>
            </TableCdnCache>
          </yd-table>
        </el-form-item>
        <el-form-item label="忽略请求头中 Cache-Control 和 Pragma">
          <yd-form-radio
            v-model="form.ctrl_f5_refresh"
            :radios="addReserved(SELECT.SWITCH_NUM_REVERSE, 'keep')"
          />
        </el-form-item>
        <el-form-item label="缓存时忽略URL中的参数">
          <yd-form-radio
            v-model="form.ignore_args"
            :radios="addReserved(SELECT.SWITCH_NUM, 'keep')"
          />
        </el-form-item>
        <el-form-item label="参数顺序识别">
          <yd-form-radio
            v-model="form.sort_args"
            :radios="addReserved(SELECT.SWITCH_NUM, 'keep')"
          />
        </el-form-item>
        <el-form-item label="HTTP / HTTPS 缓存共用">
          <yd-form-radio
            v-model="form.ignore_scheme"
            :radios="addReserved(SELECT.SWITCH_NUM, 'keep')"
          >HTTP / HTTPS 缓存共用</yd-form-radio>
        </el-form-item>
        <el-form-item label="遵循源站响应头部缓存规则">
          <yd-form-radio
            v-model="form.upstream_cache_control_first"
            :radios="addReserved(SELECT.SWITCH_NUM, 'keep')"
          >遵循源站响应头部缓存规则</yd-form-radio>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button
        type="text"
        @click="handleClose"
      >取消</el-button>
      <el-button
        :loading="loadingSubmit"
        type="primary"
        @click="handleSubmit"
      >保存</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import create from '@/utils/create-basic'
import FormItemAction from '@/components/FormItem/FormItemAction'
import { deepClone } from '@/utils'
import TableCdnCache from './TableCdnCache'
import diloagBatch from '../../../../mixins/dialog-batch'

const FORM = {
  status: 'keep',
  ctrl_f5_refresh: 'keep',
  ignore_args: 'keep',
  sort_args: 'keep',
  ignore_scheme: 'keep',
  upstream_cache_control_first: 'keep',
  cache_type: 'yes'
  // psource: 'append'
}

export default create({
  name: 'dialogCdnCache',

  mixins: [diloagBatch],

  components: {
    TableCdnCache, FormItemAction
  },

  data() {
    return {
      title: '高级缓存',
      psource: 'append',
      open: false,
      cacheType: 'yes',
      form: deepClone(FORM),
      listRules: [],
      loadingSubmit: false
    }
  },

  methods: {
    handleStatusChange(val) {
      if (val === 'on') {
        this.$nextTick(() => {
          this.$refs.list.handleInit()
        })
      }
    },
    handleOpen() {
      this.form = deepClone(FORM)
      this.psource = 'append'
      this.$nextTick(() => {
        this.$refs.list.handleInit()
      })
      this.open = true
    },

    handleClose() {
      this.open = false
    },

    async handleSubmit() {
      const form = deepClone(this.form)
      form._policy = form.status
      const formData = {
        cdn_advance_cache: form
      }

      // if (form.status === 'on') {
      const table = this.$refs.list
      try {
        await table.handleCheck()
      } catch (e) {
        return
      }

      const { listView } = this.$refs.list

      if (listView && listView.length > 0) {
        formData.cdn_advance_cache_rules = {
          _policy: this.psource,
          rules: listView,
          cache_type: listView[0].cache_type
        }
      }

      const data = {
        id: '__RAW__',
        name: 'dialogCdnCache',
        form: formData
      }
      this.$emit('submit', data)
    }
  }
})
</script>
