<template>
  <yd-card
    horizontal
    title="篡改监控"
  >
    <template slot="tips">
      <p>实时监测网站内容是否被篡改，联动{{ $t('red-guard.title') }}网站快照可立即恢复被篡改页面展示</p>
    </template>
    <yd-form-select
      slot="action"
      :selects="Label.status"
      v-model="form.tamper"
      @change="handleUpdate"
    />
    <el-form
      v-if="form.tamperSetting"
      label-position="right"
      label-width="150px"
    >
      <el-form-item label="源服务器IP">
        <el-input
          v-model="form.tamperSetting.source_ip"
          style="width: 200px"
          placeholder="1.1.1.1"
          @blur="handleUpdate"
        />
      </el-form-item>
      <el-form-item label="篡改处理方式">
        <yd-form-radio
          :radios="Label.pattern"
          v-model="form.tamperSetting.pattern"
          @change="handleUpdate"
        />
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import mixins from './mixins'

export default {
  mixins: [mixins],

  data() {
    return {
      Label: {
        status: [
          {
            label: 'ON',
            value: true
          },
          {
            label: 'OFF',
            value: false
          }
        ],
        pattern: [
          {
            label: '不处理',
            value: 0
          }
          // {
          //   label: '联动网站快照',
          //   value: 1
          // }
        ]
      }
    }
  },

  methods: {
    init(data) {
      const form = {
        detection_id: data.detection_id,
        tamper: data.tamper,
        tamperSetting: {
          source_ip: '',
          pattern: 0
        }
      }

      if (data.extend && data.extend.tamperSetting) {
        form.tamperSetting = data.extend.tamperSetting
      }
      this.form = form
    }
  }
}
</script>
