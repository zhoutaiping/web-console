<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="false"
    title="源站保护"
  >
    <template slot="tips">
      根据源站处理性能，设置一定时间内回源请求次数限制，配置后超出的请求将被丢弃，可有效防止回源请求过大导致服务器过载
    </template>
    <DmAlert>
      <p>1. 请求次数为全局请求次数，非单个节点IP回源请求次数</p>
      <p>2. 设置前请确认正常业务回源请求大小，否则可能影响业务使用体验</p>
    </DmAlert>
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      inline
      label-width="120px"
      label-position="left"
    >
      <el-form-item label="回源请求数">
        <el-form-item prop="second">
          <el-input-number
            v-model="form.second"
            :min="1"
            :max="300"
            controls-position="right"
            style="width: 120px; margin-right: 6px"
            placeholder="秒"
            @blur="handleUpdate"
          />
          秒
        </el-form-item>
        <el-form-item prop="num">
          <el-input-number
            v-model="form.num"
            :min="1"
            :max="3600"
            controls-position="right"
            style="width: 120px; margin-right: 6px"
            placeholder="次"
            @blur="handleUpdate"
          />
          次
        </el-form-item>
      </el-form-item>
    </el-form>
    <SelectSwitch
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="handleUpdate"
    />
  </CardItemForm>
</template>

<script>
import create from '@/utils/create-basic'
import { validatorNumber } from '@/utils/validator'
import SelectSwitch from '@/components/Select/SelectSwitch'
import consoleItem from '../../../../../mixins/consoleItem'

export default create({
  name: 'CardDefenseRefer',

  components: { SelectSwitch },

  mixins: [consoleItem],

  data() {
    return {
      SETTING_ID: 'source_site_protect',
      rules: {
        num: {
          validator: validatorNumber(1, Number.MAX_VALUE), trigger: 'blur', message: ' '
        },
        second: {
          validator: validatorNumber(1, Number.MAX_VALUE), trigger: 'blur', message: ' '
        }
      },
      formDefault: {
        status: 'off',
        second: 10,
        num: 1000
      }
    }
  },

  methods: {
    async handleUpdate() {
      await this.confirmAction()
      this.$refs.Form.validate(async valid => {
        if (!valid) return
        this.fetchUpdate()
      })
    }
  }
})
</script>
