<template>
  <yd-card
    horizontal
    title="异常响应码"
  >
    <template slot="tips">
      <p>实时监测网站中的异常状态码，支持用户自定义</p>
    </template>
    <yd-form-select
      slot="action"
      :selects="Label.status"
      v-model="form.statusCode"
      @change="handleUpdate"
    />
    <yd-alert>
      <p>异常响应码：可自定义异常响应码，如为空系统默认非2xx和3xx返回码为异常响应码</p>
      <p>多个异常响应码请用“,”隔开</p>
    </yd-alert>
    <el-form
      label-position="right"
      label-width="150px"
    >
      <el-form-item label="自定义异常状态码">
        <el-input
          v-model="form.statusCodeList"
          :rows="4"
          :max="320"
          placeholder="自定义异常状态码, 多个逗号分隔"
          style="width: 400px"
          type="textarea"
          @blur="handleUpdate"
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
            label: 'OFF',
            value: false
          },
          {
            label: 'ON',
            value: true
          }
        ]
      }
    }
  },

  methods: {
    init(data) {
      const form = {
        detection_id: data.detection_id,
        statusCode: data.statusCode,
        statusCodeList: data.statusCodeList
      }
      this.form = form
    }
  }
}
</script>
