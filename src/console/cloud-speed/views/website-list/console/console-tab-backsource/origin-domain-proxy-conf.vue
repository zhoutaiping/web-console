<style lang="scss" scoped>
/deep/.el-input__inner {
  text-align: left;
}
</style>
<template>
  <div>
    <el-form
      ref="Form"
      :rules="rules"
      :model="form"
      label-position="left"
      label-width="170px"
    >
      <yd-card
        horizontal
        title="回源请求时长"
      >
        <template slot="tips">
          安全节点回源请求连接等待时长
        </template>
        <yd-alert>
          <p>安全节点的回源请求TCP建连超时等待时间默认为30秒，您可以根据实际需求设置回源请求的最长等待时间，最长不超过300s。</p>
        </yd-alert>

        <el-form-item
          label="节点与源建连超时时间"
          prop="proxy_connect_timeout"
        >
          <el-input-number
            v-model="form.proxy_connect_timeout"
            :controls="false"
            :precision="0"
            :min="0"
            :max="300"
            style="width: 200px"
            placeholder="0-300，默认30"
            @change="handleUpdate"
          />
          秒
        </el-form-item>
      </yd-card>
      <template v-if="domainPlanInfo.meal_flag !== 'YD-WEBAQJS-TY'">
        <yd-card
          horizontal
          title="回源健康检查"
        >
          <template slot="tips">
            对于存在多个源IP，当安全节点在指定时间间隔内回源到某个源的失败次数超过指定次数时，将在指定时间内禁用此源IP。
          </template>

          <el-form-item
            label="回源失败次数"
            prop="max_fails"
          >
            <el-input-number
              :controls="false"
              v-model="form.max_fails"
              :precision="0"
              :min="0"
              :max="300"
              style="width: 200px"
              placeholder="0-300，默认30"
              @change="handleUpdate"
            />
            次
          </el-form-item>
          <el-form-item
            label="回源失败统计时间间隔"
            prop="fails_timeout"
          >
            <el-input-number
              :controls="false"
              v-model="form.fails_timeout"
              :min="0"
              :max="1000"
              style="width: 200px"
              placeholder="默认10"
              @change="handleUpdate"
            />
            秒
          </el-form-item>
          <el-form-item
            label="回源失败禁用不可用IP时间"
            prop="keep_new_src_time"
          >
            <el-input-number
              :controls="false"
              v-model="form.keep_new_src_time"
              :min="0"
              :max="1000"
              style="width: 200px"
              placeholder="默认30"
              @change="handleUpdate"
            />
            秒
          </el-form-item>

        </yd-card>
      </template>
      <yd-card
        horizontal
        title="回源保持长连接"
      >
        <template slot="tips">
          回源使用连接保活可以复用现有的连接（需源服务器支持keepalive），避免每次请求都重新建立TCP请求，可大幅提升回源性能，减小延迟。
        </template>
        <SelectSwitch
          slot="action"
          v-model="form.proxy_keepalive"
          :on-value="1"
          :off-value="0"
          @change="handleUpdate"
        />
      </yd-card>
    </el-form>
  </div>
</template>
<script>
import { validatorNumber } from '@/utils/validator'
import panelMixins from '../panelMixins'
import domainMixins from '@/mixins/domain'
import SelectSwitch from '@/components/Select/SelectSwitch'
export default {
  name: 'OriginDomainProxyConf',
  components: { SelectSwitch },
  mixins: [panelMixins, domainMixins],
  data() {
    return {
      SETTING_ID: 'domain_proxy_conf',
      formDefault: {
        max_fails: 30,
        fails_timeout: 10,
        keep_new_src_time: 30,
        proxy_keepalive: 0,
        proxy_connect_timeout: 30
      },
      rules: {
        max_fails: {
          validator: validatorNumber(0, 300), trigger: 'blur', message: ' '
        },
        fails_timeout: {
          validator: validatorNumber(0, 1000), trigger: 'blur', message: ' '
        },
        keep_new_src_time: {
          validator: validatorNumber(0, 1000), trigger: 'blur', message: ' '
        },
        proxy_connect_timeout: {
          validator: validatorNumber(0, 300), trigger: 'blur', message: ' '
        }
      }
    }
  },

  methods: {

    async handleUpdate() {
      this.$refs.Form.validate(valid => {
        if (!valid) {
          return
        }
        this.fetchUpdate()
      })
    }
  }
}
</script>
