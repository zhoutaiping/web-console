<template>
  <yd-card
    horizontal
    title="风险外链监控"
  >
    <template slot="tips">
      <p>实时监控网站中恶意链接和友链的内容安全，包括敏感词监控与篡改监控</p>
    </template>
    <DmAlert>
      外链敏感词监控与本站敏感词监控共用一套词库，可在“敏感词监控”模块进行自定义敏感词设置。
    </DmAlert>

    <yd-form-select
      slot="action"
      :selects="selectOp"
      v-model="form.outerInspect"
      @change="handleUpdate"
    />
    <el-form
      label-position="right"
      label-width="150px"
    >
      <el-form-item label="外链敏感词监控">
        <yd-form-select
          :selects="selectStatus"
          v-model="form.outSensitiveWordType"
          @change="handleUpdate"
        />
      </el-form-item>
      <el-form-item label="外链变动监控">
        <el-switch
          v-model="form.outerInspectTamper"
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
      selectOp: [
        {
          label: 'ON',
          value: true
        },
        {
          label: 'OFF',
          value: false
        }
      ],
      selectStatus: [
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
  },

  methods: {
    init(data) {
      const form = {
        detection_id: data.detection_id,
        outSensitiveWordType: Number(data.outSensitiveWordType),
        outerInspect: data.outerInspect,
        outerInspectTamper: data.outerInspectTamper,
      }
      this.form = form
    }
  }
}
</script>
