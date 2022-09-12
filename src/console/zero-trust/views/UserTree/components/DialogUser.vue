<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="750px"
    aside
    title-label="用户"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :rules="formRules"
      :model="form"
      label-width="100px"
    >
      <el-form-item
        prop="groups"
        label="所属部门"
      >
        <el-cascader
          v-model="form.groups"
          :options="treeData"
          :props="{
            value: 'id',
            label: 'label',
            expandTrigger: 'hover',
            multiple: true
          }"
          change-on-select
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item
        label="用户名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          style="width: 280px"
          placeholder="用户名称"
        />
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="mobile"
      >
        <el-input
          v-model="form.mobile"
          style="width: 280px"
          placeholder="手机号"
        />
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="form.email"
          style="width: 280px"
          placeholder="邮箱"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remarks"
      >
        <el-input
          v-model="form.remarks"
          :rows="3"
          placeholder="备注"
          style="width: 280px"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import { fetchTree, formatFullValues } from '../utils'

function formatExportGroups(list) {
  return list.map(item => {
    return item.length ? item[item.length - 1] : item[0]
  })
}

export default createDialog({
  data() {
    return {
      id: '',
      treeData: [],
      formDefault: {
        email: '',
        enabled: true,
        groups: null,
        mobile: '',
        name: '',
        remarks: ''
      },
      formRules: {
        name: {
          required: true,
          message: '请填写名称',
          trigger: 'blur'
        },
        email: {
          required: true,
          message: '请填写邮箱',
          trigger: 'blur'
        },
        mobile: {
          required: true,
          message: '请填写手机号',
          trigger: 'blur'
        },
        groups: {
          required: true,
          message: '请选择所属部门',
          trigger: 'blur'
        }
      }
    }
  },

  methods: {
    async initOptions(form, options) {
      const { id } = form
      this.mode = id ? 'Edit' : 'Create'
      this.id = id

      const { list, defaultValue } = await fetchTree()
      if (this.mode === 'Create') {
        if (form.groups === 'root') {
          this.form.groups = [[defaultValue]]
        } else {
          this.form.groups = formatFullValues([form.groups], list)
        }
      } else {
        this.form.groups = formatFullValues(form.groups, list)
      }
      this.treeData = list
    },

    // async fetchTree() {
    //   const data = await this.Fetch.post('V4/zero.trust.yunad.organization.all')
    //   this.treeData = formatTree(data)

    //   if (data.length && this.mode === 'Create') {
    //     this.form.groups = [[data[0].id]]
    //   }
    // },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const form = {
        ...this.form,
        groups: formatExportGroups(this.form.groups)
      }

      if (this.mode === 'Create') {
        await this.Fetch.post('V4/zero.trust.yunad.user.add', form)
      } else {
        await this.Fetch.post('V4/zero.trust.yunad.user.save', form)
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
