<template>
  <div>
    <DmAlert>
      <p>1. 请求次数为全局请求次数，非单个节点IP回源请求次数</p>
      <p>2. 设置前请确认正常业务回源请求大小，否则可能影响业务使用体验</p>
    </DmAlert>
    <el-form
      v-if="form.status === 'on'"
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
          <el-input
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
  </div>
</template>

<script>
import { validatorNumber } from '@/utils/validator'
import SelectSwitch from '@/components/Select/SelectSwitch'
import { addReserved } from '@/utils/form'
import baseMixins from './base'

export default {
  components: { SelectSwitch },

  mixins: [baseMixins],

  data() {
    return {
      config: {
        selectStatus: [
          {
            value: 'off',
            label: 'OFF'
          },
          {
            value: 'on',
            label: 'ON'
          }
        ]
      },
      rules: {
        num: {
          validator: validatorNumber(1, Number.MAX_VALUE), trigger: 'blur', message: ' '
        },
        second: {
          validator: validatorNumber(1, Number.MAX_VALUE), trigger: 'blur', message: ' '
        }
      },
      formDefault: {
        status: 'keep',
        second: 10,
        num: 1000
      }
    }
  },

  methods: {
    setStatus(value) {
      this.form.status = value
    },

    handleUpdate() { },

    setForm(form = {}) {
      this.form = {
        ...this.formDefault,
        ...form
      }
    },

    getForm() {
      return {
        ...this.form
      }
    },

    initConfig() {
      this.$emit('initConfig', {
        selectStatus: addReserved(this.config.selectStatus, 'keep', this.isBatch)
      })
    }
  }
}
</script>
