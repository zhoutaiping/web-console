<template>
  <div>
    <!-- 连接阻断 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="连接阻断"
    >
      <template slot="tips">将 ICMP 报文全部丢弃，开启后其下所有策略将不在生效</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.dropIcmpAllSwitch"
        @change="adsFetchSaveSettings"
      />
    </CardItemForm>
    <!-- ICMP Flood 防御 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="ICMP Flood 防御"
    >
      <template slot="tips">当达到阈值后进行防御，同时对滤后流量进行限速</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.icmpProtectionSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="150px"
      >
        <el-form-item label="阈值">
          <el-input-number
            v-model="adsSettings.icmpPpsThreshold"
            :min="0"
            :max="1000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-1,000,000）</span>
        </el-form-item>
        <el-form-item label="限速">
          <el-input-number
            v-model="adsSettings.icmpPpsLimit"
            :min="0"
            :max="1000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-1,000,000）</span>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form>
        <el-form-item>
          <el-checkbox v-model="adsSettings.icmpEnhanceProtectionSwitch">ICMP 增强防御</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-input-number
            v-model="adsSettings.srcIcmpStatsTime"
            :min="0"
            :max="60"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >秒（范围：0-60）</span>
          <el-input-number
            v-model="adsSettings.srcIcmpPpsMin"
            :min="0"
            :max="1000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >个（阈值范围：0-1,000）</span>
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

  mixins: [adsMixins]
}
</script>
