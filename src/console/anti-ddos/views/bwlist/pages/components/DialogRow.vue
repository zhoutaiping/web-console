<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    aside
    @submit="handleSubmit"
  >
    <el-form
      :model="form"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="类型">
        <yd-form-radio
          v-model="type"
          :radios="selectType"
          @change="form.dstIp = ''"
        />
      </el-form-item>
      <el-form-item label="源IP">
        <el-input
          v-model="form.srcIp"
          type="textarea"
          style="width: 250px"
          placeholder="0.0.0.0"
        />
      </el-form-item>
      <el-form-item label="目标">
        <yd-form-radio :radios="selectTarget" v-model="targetType" />
      </el-form-item>
      <el-form-item v-show="targetType === TARGET_IP" label="目标IP">
        <el-input
          v-model="form.dstIp"
          type="textarea"
          style="width: 250px"
          placeholder="0.0.0.0"
        />
      </el-form-item>
      <el-form-item v-show="targetType === TARGET_CLUSTER" label="选择集群">
        <yd-form-select
          :selects="adsSelectCluster"
          v-model="form.clusterId"
          default-text="全部集群"
          style="width: 250px"
        />
      </el-form-item>
      <!-- <el-form-item
        label="是否启用"
        prop="title"
      >
        <el-switch v-model="form.status" />
      </el-form-item> -->
      <el-form-item
        label="备注"
        prop="note"
      >
        <el-input
          v-model="form.note"
          placeholder="备注"
          style="width: 250px"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import adsMixins from '../../../../mixins/ads'

const TARGET_CLUSTER = 'public'
const TARGET_IP = 'private'

export default createDialog({
  mixins: [adsMixins],

  data() {
    return {
      TARGET_CLUSTER,
      TARGET_IP,
      formDefault: {
        srcIp: '',
        clusterId: '',
        dstIp: '',
        note: '',
        status: true
      },
      targetType: TARGET_CLUSTER,
      type: 'black',
      selectType: [
        {
          label: '黑名单',
          value: 'black'
        },
        {
          label: '白名单',
          value: 'white'
        }
      ],
      selectTarget: [
        {
          label: '集群',
          value: TARGET_CLUSTER
        },
        {
          label: 'IP',
          value: TARGET_IP
        }
      ]
    }
  },

  methods: {
    initOptions(form, options) {
      this.adsFetchClusterList()

      this.mode = form.uuid ? 'Edit' : 'Create'
      if (this.mode === 'Edit') {
        this.type = form.black ? 'black' : 'white'
        this.targetType = form.global ? TARGET_CLUSTER : TARGET_IP
      } else {
        this.type = 'black'
        this.targetType = TARGET_CLUSTER
      }
    },

    async fetchSubmit() {
      const form = {
        ...this.form,
        blackWhiteType: `${this.targetType}_${this.type}`
      }
      try {
        await this.$Ads.post('admin/bwlist/saveApi', form)
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
