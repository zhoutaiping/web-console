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
        提供 SSL服务
        <yd-form-select
          slot="action"
          v-model="form.status"
          :selects="addReserved(selectStatus, 'keep')"
        />
      </FormItemAction>
      <yd-alert style="margin-top: 12px">
        <p>共享 SSL 基于 SNI 实现，因此某些不支持 SNI 的旧式浏览器访问可能会有些问题。运行在 Windows XP 上的所有版本的 Internet Explorer 都不支持 SNI</p>
        <p>如您需要独享 SSL 请联系我们的销售顾问</p>
        <p>HSTS 为强制客户端（如浏览器）使用 HTTPS 与服务器创建连接，启用 HSTS 前请先启用 HTTPS 协议</p>
        <p>关闭 HTTPS 协议前为防止网站无法正常访问请先关闭 HSTS, HSTS 关闭后浏览器仍有一个月配置生效时间</p>
      </yd-alert>
      <el-form
        label-position="left"
        label-width="140px"
      >
        <el-form-item label="HTTP 跳转 HTTPS">
          <el-radio-group v-model="form.http2https">
            <el-radio
              class="radio"
              label="keep"
            >保留原配置</el-radio>
            <el-radio
              class="radio"
              label="off"
            >关闭</el-radio>
            <el-radio
              class="radio"
              label="all"
            >全量跳转</el-radio>
            <el-radio
              class="radio"
              label="special"
            >指定浏览器跳转</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="HTTP2">
          <yd-form-radio
            v-model="form.http2"
            :radios="addReserved(SELECT.SWITCH_M2, 'keep')"
          />
        </el-form-item> -->
        <el-form-item label="HSTS">
          <yd-form-radio
            :disabled="form.status === 'off' || form.status === 'keep'"
            v-model="hsts"
            :radios="addReserved(SELECT.SWITCH_M2, 'keep')"
          />
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
import Domain from '@/api/domain'
import { deepClone } from '@/utils'
import FormItemAction from '@/components/FormItem/FormItemAction'
import diloagBatch from '../../../../mixins/dialog-batch'

const FORM = {
  status: 'keep',
  http2https: 'keep',
  http2: 'keep',
  certificate_id: 'keep',
  certificate_type: 'keep'
}

export default create({
  name: 'dialogHttps',

  mixins: [diloagBatch],

  components: { FormItemAction },

  data() {
    return {
      title: 'HTTPS',
      open: false,
      form: {},
      loadingSubmit: false,
      hsts: 'keep',
      selectStatus: []
    }
  },

  methods: {
    async init() {
      const params = {}
      if (this.batchSelectType === 'custom') {
        params.domains = this.selectsList.map(_ => _.label)
      } else {
        params.group_id = this.batchGroupId
      }
      const list = await Domain.batchCalList(params)

      const selectStatus = [
        {
          label: 'OFF',
          value: 'off'
        }
      ]

      this.selectStatus = selectStatus.concat(list.map(_ => {
        return {
          label: _.ca_name,
          value: _.id
        }
      }))
    },

    async handleOpen() {
      await this.init()
      this.form = deepClone(FORM)
      this.hsts = 'keep'
      this.open = true
    },

    handleClose() {
      this.open = false
    },

    handleSubmit() {
      const form = deepClone(this.form)
      form._policy = form.status

      if (form.status !== 'off' && form.status !== 'keep') {
        form.certificate_id = form.status
        form.certificate_type = 'self'
        form.status = 'on'
        form._policy = 'on'
      }

      const formData = {
        https: form
      }

      if (form.status !== 'off' && form.status !== 'keep') {
        formData.hsts = {
          _policy: this.hsts,
          status: this.hsts
        }
      }

      const data = {
        id: '__RAW__',
        name: 'dialogHttps',
        form: formData
      }
      this.$emit('submit', data)
    }
  }
})
</script>
