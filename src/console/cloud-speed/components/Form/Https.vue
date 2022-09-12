<template>
  <div>
    <DmAlert>
      <p>共享 SSL 基于 SNI 实现，因此某些不支持 SNI 的旧式浏览器访问可能会有些问题。运行在 Windows XP 上的所有版本的 Internet Explorer 都不支持 SNI</p>
      <p>如您需要独享 SSL 请联系我们的销售顾问</p>
      <p>HSTS 为强制客户端（如浏览器）使用 HTTPS 与服务器创建连接，启用 HSTS 前请先启用 HTTPS 协议</p>
      <p>关闭 HTTPS 协议前为防止网站无法正常访问请先关闭 HSTS, HSTS 关闭后浏览器仍有一个月配置生效时间</p>
    </DmAlert>
    <el-form
      v-show="!['off', 'keep'].includes(form.status)"
      label-position="left"
      label-width="140px"
    >
      <el-form-item label="选择证书">
        <yd-form-select
          :selects="addReserved(selectCA, 'keep', isBatch)"
          v-model="form.certificate_id"
          default-text="选择证书"
        />
      </el-form-item>
      <el-form-item label="HTTP 跳转 HTTPS">
        <yd-form-radio
          v-model="form.http2https"
          :radios="addReserved(moduleLabel['cloud-speed'].HTTP2_HTTPS, 'keep', isBatch)"
        />
      </el-form-item>
      <!-- <el-form-item label="HTTP2">
        <yd-form-radio
          v-model="form.http2"
          :radios="addReserved(SELECT.SWITCH_M2, 'keep', isBatch)"
        />
      </el-form-item> -->
      <el-form-item label="HSTS">
        <yd-form-radio
          v-model="form.hsts"
          :disabled="form.status === 'off' || form.status === 'keep'"
          :radios="addReserved(SELECT.SWITCH_M2, 'keep', isBatch)"
        />
      </el-form-item>
      <el-form-item label="支持的最小TLS版本">
        <yd-form-select
          v-model="form.min_version"
          :selects="MIN_VERSION"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { addReserved } from '@/utils/form'
import baseMixins from './base'
import SELECT from '../../constant/select'

export default {
  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: [
          {
            label: 'ON',
            value: 'on'
          },
          {
            label: 'OFF',
            value: 'off'
          }
        ]
      },
      formDefault: {
        status: 'off',
        http2https: 'off',
        http2: 'off',
        certificate_id: '',
        min_version: 'TLSv1.0'
      },
      formDefaultBatch: {
        status: 'keep',
        http2https: 'keep',
        http2: 'keep',
        min_version: 'TLSv1.0',
        hsts: 'keep',
        certificate_id: 'keep',
        certificate_type: 'keep'
      },
      selectCA: [],
      MIN_VERSION: SELECT.MIN_VERSION
    }
  },

  methods: {
    setStatus(value) {
      this.form.status = value
    },

    setForm(form = {}) {
      this.form = {
        ...this.isBatch ? this.formDefaultBatch : this.formDefault,
        ...form
      }
    },

    getForm() {
      const form = deepClone(this.form)
      form._policy = form.status

      if (form.status !== 'off' && form.status !== 'keep') {
        form.certificate_type = 'self'
        form.status = 'on'
        form._policy = 'on'
      }

      const formData = {
        https: form,
        hsts: {
          status: 'keep',
          _policy: 'keep'
        }
      }

      if (form.status !== 'off' && form.status !== 'keep') {
        formData.hsts = {
          _policy: this.form.hsts,
          status: this.form.hsts
        }
      }
      return formData
    },

    async initConfig(formBatch) {
      const selectStatus = addReserved(this.config.selectStatus, 'keep', this.isBatch)
      if (this.isBatch) {
        const list = await this.Fetch.post('V4/Web.Domain.batch.ca.list', formBatch)
        this.selectCA = list.map(_ => {
          return {
            label: _.ca_name,
            value: _.id
          }
        })
      }
      this.$emit('initConfig', {
        selectStatus
      })
    }
  }
}
</script>
