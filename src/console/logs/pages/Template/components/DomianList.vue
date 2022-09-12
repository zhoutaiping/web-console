<style lang="less" scoped>
.DomainList {
  &__popper {
    padding: 0px;
    .footer {
      text-align: center;
      padding: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.04);
    }
  }
}
.input-box {
  width: 100%;
}
::v-deep .el-divider--horizontal {
  margin: 8px 0;
}
</style>
<template>
  <div>
    <el-popover
      :popper-class="b('popper')"
      v-model="visible"
      :width="width"
      placement="bottom-start"
      @after-enter="init"
      @hide="handleClose"
    >
      <InputSearch
        v-model="domain"
        placeholder="请输入域名"
        class="input-box"
        @submit="getDomain({domain: domain})"
      />
      <el-divider />
      <div>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <span style="float:right; margin-right:10px;">
          {{ val.length }} / {{ list.length }}
        </span>
      </div>
      <yd-scroll>
        <el-checkbox-group
          v-model="val"
          style="max-height:250px;"
        >
          <template v-loading="loading">
            <p
              v-for="item in list"
              :key="item"
              style="margin: 10px 0"
            >
              <el-checkbox :label="item">
                {{ item }}
              </el-checkbox>
            </p>
          </template>
        </el-checkbox-group>
      </yd-scroll>

      <div class="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >确定</el-button>
      </div>
      <template slot="reference">
        <div style="padding: 0 15px; border-radius: 3px;  border: 1px solid #e8e8e8; ">
          <template v-if="selectedTotal === 0">
            <span style="color:#C0C4CC;">请选择域名</span>
          </template>
          <template v-else-if="list.length > 0 && selectedTotal === total">
            全部域名
          </template>
          <template v-else>
            已选择 {{ selectedTotal }} / {{ total }} 个域名
          </template>
          <i
            class="el-icon-arrow-down"
            style="float:right; line-height:34px;"
          />
        </div>
      </template>
    </el-popover>
  </div>
</template>
<script>
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
export default create({
  name: 'DomainList',
  props: {
    width: {
      type: [String, Number],
      default: 400
    },
    value: Array
  },
  data() {
    return {
      val: [],
      domain: '',
      visible: false,
      loading: false,
      total: 0,
      selectedTotal: 0,
      checkAll: false,
      isIndeterminate: true,
      list: []
    }
  },
  computed: {
    valueText() {
      let text = ''
      if (this.list.length && this.selectedTotal === this.total) {
        text = '全部域名'
      } else if (this.list.length && this.selectedTotal > 0) {
        text = '已选择' + this.selectedTotal
      }
      return text
    }
  },
  methods: {
    init(list = []) {
      this.domain = ''
      this.list = []
      this.selectedTotal = 0
      this.val = list.length ? list : this.value || []
      if (this.val.length) this.selectedTotal = this.val.length
      this.getDomain()
    },
    // soc.log.download.template.domain.list
    async getDomain(params = {}) {
      this.list = []
      this.total = 0
      try {
        this.loading = true
        const data = await this.Fetch.get('/V4/soc.log.download.template.domain.list', params)
        this.list = data
        this.total = this.list.length
        this.loading = false
      } catch (error) {
        return
      }
    },

    handleCheckAllChange(val) {
      this.val = val ? deepClone(this.list) : []
      this.isIndeterminate = false
    },
    handleClose() {
      this.domain = ''
      this.list = []
    },
    setValue(list = []) {
      this.val = list
      this.selectedTotal = list.length
    },
    handleSubmit() {
      this.selectedTotal = this.val.length
      this.visible = false
      this.$emit('input', this.val)
      this.$emit('setHttpHost', {
        domain_select_type: this.val.length === this.list.length ? 1 : 0
      })
    },
    getValue() {
      return this.val || []
    }
  }
})
</script>
