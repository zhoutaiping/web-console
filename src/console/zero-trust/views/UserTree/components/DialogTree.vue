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
      :model="form"
      label-width="100px"
    >
      <el-form-item
        label="上级组织"
        prop="parent_group_id"
      >
        <el-cascader
          v-model="form.parentId"
          :options="treeData"
          :props="{
            value: 'id',
            label: 'label',
            expandTrigger: 'hover'
          }"
          disabled
          change-on-select
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item
        label="组织名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="组织名称"
          style="width: 280px"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="description"
      >
        <el-input
          v-model="form.description"
          placeholder="备注"
          style="width: 280px"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import { fetchTree } from '../utils'

// function filterDisabled(list, disabled, reDisabled) {
//   return list.map(item => {
//     const _disabled = item.id === disabled || reDisabled
//     item.disabled = _disabled
//     item = Object.assign({}, item)
//     if (item.children && item.children.length) {
//       item.children = filterDisabled(item.children, disabled, _disabled)
//     }
//     return item
//   })
// }

export default createDialog({
  mixins: [],

  data() {
    return {
      treeData: [],
      mode: '',
      id: '',
      formDefault: {
        description: '',
        name: '',
        parentId: 'root',
        realmId: ''
      },
      form: {},
      rules: {
        name: {
          required: true,
          message: '组织名称'
        }
      }
    }
  },

  methods: {
    async initOptions(form) {
      this.$refs.Form.clearValidate()
      this.mode = form.id ? 'Edit' : 'Create'
      this.id = form.id

      const { list } = await fetchTree()
      this.treeData = list
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      const form = {
        ...this.form
      }

      if (this.mode === 'Create') {
        await this.Fetch.post('V4/zero.trust.yunad.organization.add', form)
      } else {
        await this.Fetch.put('V4/zero.trust.yunad.organization.save', {
          ...form
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
