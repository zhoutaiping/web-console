<template>
  <yd-card
    horizontal
    title="HTTPS"
  >
    <SelectSwitch
      slot="action"
      :value="status"
      :selects="selectCA"
      :on-visible="false"
      on-value="on"
      off-value="off"
      @change="fetchUpdateStatus"
    />
    <template slot="tips">提供 SSL 服务</template>
    <yd-alert>
      <p>共享 SSL 基于 SNI 实现，因此某些不支持 SNI 的旧式浏览器访问可能会有些问题。运行在 Windows XP 上的所有版本的 Internet Explorer 都不支持 SNI</p>
      <p>如您需要独享 SSL 请联系我们的销售顾问</p>
      <p>HSTS 为强制客户端（如浏览器）使用 HTTPS 与服务器创建连接，启用 HSTS 前请先启用 HTTPS 协议</p>
      <p>关闭 HTTPS 协议前为防止网站无法正常访问请先关闭 HSTS, HSTS 关闭后浏览器仍有一个月配置生效时间</p>
    </yd-alert>
    <el-form
      label-position="right"
      label-width="145px"
    >
      <el-form-item label="HTTP 跳转 HTTPS">
        <el-radio-group
          v-model="form.http2https"
          @change="fetchUpdate()"
        >
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
        <TipsTooltip title="仅对支持SNI的浏览器进行https跳转" />
      </el-form-item>
      <!-- <el-form-item label="HTTP2">
        <el-switch
          v-model="form.http2"
          active-value="on"
          inactive-value="off"
          @change="fetchUpdate()"
        />
        <TipsTooltip title="HTTP/2是最新的HTTP协议，开启后使用HTTP/2来加速您的网站" />
      </el-form-item> -->
      <el-form-item label="HSTS">
        <el-switch
          :disabled="form.status === 'off'"
          v-model="formHsts.status"
          active-value="on"
          inactive-value="off"
          @change="fetchUpdateHsts"
        />
      </el-form-item>
      <template v-if="domainPlanInfo.meal_flag !== 'YD-WEBAQJS-TY'">
        <el-form-item label="支持的最小TLS版本">
          <yd-form-select
            :selects="MIN_VERSION"
            v-model="form.min_version"
            @change="fetchUpdate()"
          />
          <TipsTooltip>
            安全传输层协议（TLS）用于在两个通信应用程序之间提供保密性和数据完整性<br>
            TLS版本从低到高有四种，请结合安全性和客户端兼容性谨慎配置<br>
            SSLv3：存在严重的安全漏洞，仅兼容非常古老的客户端，强烈不推荐使用<br>
            TLSv1.0：有一定安全风险，已不符合PCI DSS合规判定标准<br>
            TLSv1.1：2006年发布，修复TLSv1.0若干漏洞，并且引入了TLS 扩展<br>
            TLSv1.2：加强了密码套件的扩展性，更好的安全性，更快的密码学算法，支持HTTP 2，目前广泛使用的版本
          </TipsTooltip>
        </el-form-item>
      </template>
    </el-form>
  </yd-card>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import TipsTooltip from '@/components/Tips/TipsTooltip'
import panelMixins from '../panelMixins'
import SELECT from '../../../../constant/select'
import domainMixins from '@/mixins/domain'
export default {
  name: 'Https',

  components: { SelectSwitch, TipsTooltip },

  mixins: [panelMixins, domainMixins],

  data() {
    return {
      SETTING_ID: 'https',
      formDefault: {
        status: 'off',
        certificate_id: '',
        http2https: 'off',
        http2: 'off',
        min_version: 'TLSv1.0'
      },
      selectCA: [],
      formHsts: {},
      formHstsDefault: {
        status: 'off'
      },
      MIN_VERSION: SELECT.MIN_VERSION
    }
  },

  computed: {
    status() {
      const { certificate_id } = this.form
      return certificate_id || 'off'
    }
  },

  watch: {
    domainSettings: {
      deep: true,
      handler() {
        const data = this.domainSettings['hsts'] || {}
        this.formHsts = {
          ...this.formHstsDefault,
          ...data
        }
      }
    }
  },

  created() {
    this.fetchCA()
  },

  methods: {
    async fetchCA() {
      const data = await this.Fetch.get('V4/Web.ca.self.cloudspeedbycertificate', { domain_id: this.domainId })
      data.forEach(item => {
        if (item.certificate_id) {
          this.selectCA.push({
            label: item.certificate_info.ca_name,
            value: item.certificate_id,
            type: item.certificate_type
          })
        }
      })
    },

    fetchUpdateStatus(status) {
      const form = this.form
      form.status = status === 'off' ? 'off' : 'on'
      form.certificate_id = status === 'off' ? '' : status
      this.fetchUpdate()
    },

    formatRequest(data) {
      if (data.certificate_id) {
        const caData = this.selectCA.find(_ => _.value === data.certificate_id)
        data.certificate_type = caData.type
      } else {
        delete data.certificate_id
      }

      return data
    },

    async fetchUpdateHsts() {
      await this.confirmAction()
      const send = this.formHsts
      try {
        await this.domainSaveSettings({ 'hsts': send })
      } catch (e) {
        return
      }
      this.domainFetchSettings('hsts')
      this.Message('ACTION_SUCCESS')
    }
  }
}
</script>

