<template>
  <div>
    <!-- 超时时长 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="超时时长"
    >
      <template slot="tips">控制针对源IP动态黑白名单时长，超时时间动态白名单IP不会进行各种挑战验证，但是会执行限速等策略</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.dynamicBlackWhiteListSwitch"
        :off-visible="false"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="150px"
      >
        <el-form-item label="超时时长">
          <el-input-number
            v-model="adsSettings.srcTrustTimeout"
            :min="0"
            :max="3600"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >秒（阈值范围：0-3,600）</span>
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
