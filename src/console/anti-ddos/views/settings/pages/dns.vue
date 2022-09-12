<template>
  <div>
    <!-- DNS 防御 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="DNS 防御"
    >
      <template slot="tips">针对DNS攻击流量进行防御</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.dnsProtectionSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="150px"
      >
        <el-form-item label="DNS QUERY防御阈值">
          <el-input-number
            v-model="adsSettings.dnsQueryPpsThreshold"
            :min="0"
            :max="100000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-100,000,000）</span>
        </el-form-item>
        <el-form-item label="DNS QUERY 防御算法">
          <yd-form-radio
            :radios="selects.dnsQueryProtectionAlg"
            v-model="adsSettings.dnsQueryProtectionAlg"
          />
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form>
        <el-form-item label="DNS 源IP限速">
          <el-input-number
            v-model="adsSettings.srcDnsQueryPpsLimit"
            :min="0"
            :max="100000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-100,000,000）</span>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item>
          <el-checkbox v-model="adsSettings.dnsPpsLimitSwitch">DNS限速阈值</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-input-number
            v-model="adsSettings.dnsPpsLimit"
            :min="0"
            :max="100000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-100,000,000）</span>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="adsSettings.srcDnsQueryAutoForbidSwitch">DNS源IP自动封禁</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-input-number
            v-model="adsSettings.srcDnsQueryStatsTime"
            :min="0"
            :max="1000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >秒（0-1000）</span>
          <el-input-number
            v-model="adsSettings.srcDnsQueryPpsMax"
            :min="0"
            :max="1000000"
            controls-position="right"
            label="最大请求数"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >最大请求数（0-1,000,000）</span>
        </el-form-item>
      </el-form>
    </CardItemForm>
  </div>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import adsMixins from '../../../mixins/ads'

export default {
  components: { SelectSwitch },

  mixins: [adsMixins],

  data() {
    return {
      selects: {
        dnsQueryProtectionAlg: [
          {
            label: 'CNAME',
            value: 0
          },
          {
            label: 'TCP',
            value: 1
          }
        ]
      }
    }
  }
}
</script>
