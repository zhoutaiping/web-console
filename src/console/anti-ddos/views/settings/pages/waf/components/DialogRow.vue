<style lang="scss" scoped>
.form-item-box {
  /deep/ .el-form-item {
    &__label {
      float: left;
      width: 120px;
    }
  }
}
.item-inline {
  display: inline-block;
  margin-bottom: 0;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    aside
    width="700px"
    title-label="规则"
    @submit="handleSubmit"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-position="left" label-width="120px">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="form.ruleName" placeholder="规则名称" style="width: 300px" />
      </el-form-item>
      <el-form-item label="协议" prop="protocol">
        <yd-form-select :selects="selects.protocol" v-model="form.protocol" />
      </el-form-item>
      <!-- <el-form-item
        label="目的IP"
        prop="dstip"
      >
        <el-input
          v-model="form.dstip"
          placeholder="0.0.0.0"
          style="width: 300px"
        />
      </el-form-item>-->
      <el-form-item label="目的端口">
        <el-form-item label="" label-width="0" class="item-inline" prop="startSrcPort">
          <el-input v-model="form.startDstPort" placeholder="0-65535" style="width: 120px" />
        </el-form-item>
        <span class="color--text-regular" style="margin-left: 10px; margin-right: 10px">-</span>
        <el-form-item label="" label-width="0" class="item-inline" prop="endDstPort">
          <el-input v-model="form.endDstPort" placeholder="0-65535" style="width: 120px" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="源端口">
        <el-form-item label="" label-width="0" class="item-inline" prop="startSrcPort">
          <el-input v-model="form.startSrcPort" placeholder="0-65535" style="width: 120px" />
        </el-form-item>
        <span class="color--text-regular" style="margin-left: 10px; margin-right: 10px">-</span>
        <el-form-item label="" label-width="0" class="item-inline" prop="endSrcPort">
          <el-input v-model="form.endSrcPort" placeholder="0-65535" style="width: 120px" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="报文长度">
        <el-form-item label="" label-width="0" class="item-inline" prop="payloadMinLen">
          <el-input v-model="form.payloadMinLen" placeholder="0-1500" style="width: 120px" />
        </el-form-item>
        <span class="color--text-regular" style="margin-left: 10px; margin-right: 10px">-</span>
        <el-form-item label="" label-width="0" class="item-inline" prop="payloadMaxLen">
          <el-input v-model="form.payloadMaxLen" placeholder="0-1500" style="width: 120px" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="指纹偏移" prop="fpOffset">
        <el-input v-model="form.fpOffset" placeholder="0-1500" style="width: 300px" />
      </el-form-item>
      <el-form-item label="指纹长度" prop="fpLength">
        <el-input v-model="form.fpLength" placeholder="0-8" style="width: 300px" />
      </el-form-item>
      <el-form-item label="指纹内容" prop="fp">
        <el-input v-model="form.fp" placeholder="以16进制表示" style="width: 300px" />
      </el-form-item>
    </el-form>
    <el-divider />
    <el-form :model="form" label-position="top" label-width="120px">
      <!-- label="处置方式"  -->
      <el-form-item prop="disposalWay">
        <span slot="label">
          处置方式：
          <span class="color--danger">
            * &nbsp;&nbsp;
            <el-tooltip placement="top-end">
              <div slot="content">
                <span>丢弃：直接丢弃</span>
                <br>
                <span>封禁：直接丢弃，并将源IP地址加入黑名单</span>
                <br>
                <span>放行：只有当报文匹配规则时才允许通过</span>
                <br>
                <span>限速：限制访问速率</span>
                <br>
              </div>
              <i class="el-icon-question color--info" />
            </el-tooltip>
          </span>
        </span>
        <yd-form-radio
          :radios="adsSelects.disposalWay"
          v-model="form.disposalWay"
          @change="e => {
            form.ppsBpsLimit = ''
            form.limitType = ''
            if (e == 4) {
              form.limitType = '1'
            }
          }"
        />
      </el-form-item>
      <template v-if="form.disposalWay === 4">
        <el-form-item class="form-item-box" label="规则限速" prop="ppsBpsLimit">
          <el-input v-model="form.ppsBpsLimit" placeholder="0-10,000,000" style="width: 300px;margin-right:10px;" />
          <el-radio-group v-model="form.limitType">
            <el-radio label="1">Mbps</el-radio>
            <el-radio label="0">pps</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <el-form-item class="form-item-box" label="备注" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="请输入内容 "
          style="width: 300px"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import adsMixins from '../../../../../mixins/ads'

export default createDialog({
  mixins: [adsMixins],

  data() {
    const validatePort = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入数字'))
      } else {
        if (Number(value) < 0) {
          callback(new Error('请输入 0~65535 数字'))
        } else if (Number(value) > 65535) {
          callback(new Error('请输入 0~65535 数字'))
        } else {
          callback()
        }
      }
    }

    const validatePayload = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入数字'))
      } else {
        if (Number(value) < 0) {
          callback(new Error('请输入 0~1500 数字'))
        } else if (Number(value) > 1500) {
          callback(new Error('请输入 0~1500 数字'))
        } else {
          callback()
        }
      }
    }
    return {
      selects: {
        protocol: [
          {
            label: '全部',
            value: 'all'
          },
          {
            label: 'TCP',
            value: 'tcp'
          },
          {
            label: 'UDP',
            value: 'udp'
          }
        ]
      },
      formDefault: {
        disposalWay: 0,
        endDstPort: '',
        endSrcPort: '',
        fp: '',
        fpLength: '',
        fpOffset: '',
        limitType: '',
        payloadMinLen: '',
        payloadMaxLen: '',
        ppsBpsLimit: '',
        protocol: 'all',
        ruleName: '',
        startDstPort: '',
        startSrcPort: '',
        status: true,
        description: ''
      },
      rules: {
        ruleName: [
          {
            required: true,
            message: ' ',
            trigger: 'blur'
          }
        ],
        protocol: [
          {
            required: true,
            message: ' ',
            trigger: 'blur'
          }
        ],
        startSrcPort: [
          {
            validator: validatePort,
            trigger: 'blur'
          }
        ],
        endSrcPort: [
          {
            validator: validatePort,
            trigger: 'blur'
          }
        ],
        startDstPort: [
          {
            validator: validatePort,
            trigger: 'blur'
          }
        ],
        endDstPort: [
          {
            validator: validatePort,
            trigger: 'blur'
          }
        ],
        payloadMinLen: [
          {
            validator: validatePayload,
            trigger: 'blur'
          }
        ],
        payloadMaxLen: [
          {
            validator: validatePayload,
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    initOptions(form, options) {
      this.mode = form.uuid ? 'Edit' : 'Create'
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })
      const form = {
        protectTemplateId: this.$route.params.id,
        ...this.form
      }
      try {
        await this.$Ads.post('admin/accurate/saveApi', form)
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
