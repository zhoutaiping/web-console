<template>
  <DmDialog
    ref="Dialog"
    width="650px"
    aside
    title="编辑授权对象"
    @submit="handleSubmit"
  >
    <el-form
      label-position="left"
      class="margin-top"
    >
      <el-form-item label="授权服务">
        {{ row.name }}
      </el-form-item>
      <el-form-item label="授权操作">
        {{ row.group_name }}
      </el-form-item>
      <el-form-item label="授权对象">
        <el-checkbox v-model="selectAll">主账户内全部对象（含后期新购）</el-checkbox>
        <SelectTransfer
          v-if="!selectLoading"
          v-show="!selectAll"
          v-model="select"
          :data="selectItem"
          class="margin-top"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import SelectTransfer from '@/components/Select/SelectTransfer'
import accessMixins from '../../../mixins/access'

export default createDialog({
  components: { SelectTransfer },

  mixins: [accessMixins],

  data() {
    return {
      selectAll: false,
      select: [],
      row: {},
      index: '',
      selectItem: [],
      selectMap: {},
      selectLoading: true
    }
  },

  methods: {
    async fetchSelect(row) {
      this.selectLoading = true
      const labelKey = Object.keys(row.setting_list)[0]

      if (!labelKey) return
      const valueKey = row.setting_list[labelKey]
      const data = await this.Fetch.get(`V4/${row.setting_type}`, { per_page: 999 })

      data.list.forEach(item => {
        this.selectMap[item[valueKey]] = item[labelKey]
      })

      this.selectItem = data.list.map(_ => {
        return {
          label: _[labelKey],
          value: _[valueKey]
        }
      })
      this.selectLoading = false
    },

    beforeOpen(row) {
      this.fetchSelect(row)
      this.selectAll = row.resource[0] === 'all'
      this.select = row.resource[0] === 'all' ? [] : row.resource
      this.row = row
    },

    async handleSubmit() {
      const resource = this.selectAll ? ['all'] : this.select
      const resourceView = resource.map(_ => this.selectMap[Number(_)])
      const row = {
        ...this.row,
        resource,
        resourceView
      }
      this.$emit('submit', row)
      this.handleClose()
    }
  }
})
</script>
