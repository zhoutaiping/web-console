<template>
  <yd-card
    horizontal
    title="敏感词监控"
  >
    <template slot="tips">
      <p>实时监测网站中存在的敏感信息</p>
    </template>
    <DmAlert>
      默认词库模式：采用系统自带词库<br>
      自定义词库模式：需要输入自定义敏感词，并且系统仅对自定义敏感词进行检测<br>
      混合词库模式：系统将对系统默认词库和自定义词库进行检测
    </DmAlert>
    <yd-form-select
      slot="action"
      :selects="Label.status"
      v-model="form.sensitiveWordType"
      @change="handleUpdate"
    />
    <el-form
      label-position="right"
      label-width="150px"
    >
      <el-form-item label="自定义敏感词">
        <el-input
          v-model="form.sensitiveWordList"
          :rows="4"
          :max="320"
          placeholder="请输入需要监控的敏感词，多个敏感词使用逗号分割，最多320个字符"
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
            value: 0
          },
          {
            label: '默认词库模式',
            value: 1
          },
          {
            label: '自定义词库模式',
            value: 2
          },
          {
            label: '混合词库模式',
            value: 3
          }
        ]
      }
    }
  },

  methods: {
    init(data) {
      console.log(444, data)
      const form = {
        detection_id: data.detection_id,
        sensitiveWordType: data.sensitiveWordType,
        sensitiveWordList: data.sensitiveWordList
      }
      this.form = form
    }
  }
}
</script>
