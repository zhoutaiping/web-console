<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="550px"
    title-label="组织"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="组织名称"
      >
        <el-input
          v-model="form.group_name"
          placeholder="组织名称"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item
        label="上级组织"
        prop="parent_group_id"
      >
        <template v-if="treeData.length">
          <template v-if="mode === 'Edit' && form.isRoot">
            <el-input
              value="无"
              disabled
              style="width: 280px"
            />
          </template>
          <template v-else>
            <el-cascader
              v-model="form.parent_group_id"
              :options="treeData"
              :props="{
                value: 'id',
                label: 'group_name',
                expandTrigger: 'hover'
              }"
              change-on-select
              style="width: 280px"
            />
          </template>
        </template>
        <template v-else>
          <el-input
            value="无"
            disabled
            style="width: 280px"
          />
        </template>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          placeholder="备注"
          style="width: 280px"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import accessMixins from '../../../mixins/access'

function filterDisabled(list, disabled, reDisabled) {
  return list.map(item => {
    const _disabled = item.id === disabled || reDisabled
    item.disabled = _disabled
    item = Object.assign({}, item)
    if (item.children && item.children.length) {
      item.children = filterDisabled(item.children, disabled, _disabled)
    }
    return item
  })
}

export default createDialog({
  mixins: [accessMixins],

  data() {
    return {
      treeData: [],
      mode: '',
      id: '',
      formDefault: {
        group_name: '',
        remark: '',
        sub_users: [],
        strategy_ids: [],
        parent_group_id: ''
      },
      form: {},
      rules: {
        group_name: [
          {
            required: true,
            message: '组织名称',
            trigger: 'blur'
          },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    initOptions(form) {
      this.fetchTree()
      this.mode = form.id ? 'Edit' : 'Create'
      this.id = form.id
    },

    async fetchTree() {
      const { list = [] } = await this.Fetch.get('V4/permission.get.subUserGroupTree')
      if (this.mode === 'Create') {
        if (list.length) {
          this.form.parent_group_id = [list[0].id]
        } else {
          this.form.parent_group_id = 0
        }
      }

      this.treeData = filterDisabled(list, this.form.id)
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const parent_group_id = this.form.parent_group_id
      const form = {
        group_name: this.form.group_name,
        remark: this.form.remark,
        parent_group_id: (Array.isArray(parent_group_id) && parent_group_id.length) ? parent_group_id[parent_group_id.length - 1] : parent_group_id
      }

      if (this.form.id) form.id = this.id

      if (this.mode === 'Create') {
        await this.Fetch.post('V4/permission.add.subUserGroup', form)
      } else {
        await this.Fetch.put('V4/permission.edit.subUserGroupV1', {
          ...form,
          id: this.id
        })
      }
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
