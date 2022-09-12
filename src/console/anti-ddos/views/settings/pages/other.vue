<template>
  <div>
    <!-- 连接阻断 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="连接阻断"
    >
      <template slot="tips">将除 TCP、UDP、ICMP 以外的其他服务的报文全部丢弃。开启后其下策略将不再生效</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.dropOtherAllSwitch"
        @change="adsFetchSaveSettings"
      />
    </CardItemForm>
    <!-- Other 防御 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="Other 防御"
    >
      <template slot="tips">当达到阈值后进行防御，同时对滤后流量进行限速</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.otherProtectionSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="150px"
      >
        <el-form-item label="阈值">
          <el-input-number
            v-model="adsSettings.otherBpsThreshold"
            :min="0"
            :max="1000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >Mbps（阈值范围：0-1,000）</span>
        </el-form-item>
        <el-form-item label="限速">
          <el-input-number
            v-model="adsSettings.otherBpsLimit"
            :min="0"
            :max="1000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >Mbps（阈值范围：0-1,000）</span>
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
        ackProtectionAlg: [
          {
            label: '严格',
            value: 0
          },
          {
            label: '宽松',
            value: 1
          }
        ]
      }
    }
  }
}
</script>
