<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="mode"
    width="500px"
    title-label="子账号"
    aside
    @submit="handleSubmit"
  >
    <DmAlert>
      请使用子账号名称和密码登录子账号
    </DmAlert>
    <el-form
      ref="Form"
      :rules="rules"
      :model="form"
      label-position="right"
      label-width="100px"
      style="width: 400px"
    >
      <el-form-item
        label="子账号名称"
        prop="user_name"
      >
        <el-input
          v-model="form.user_name"
          autocomplete="new-password"
          placeholder="子账号名称"
        />
      </el-form-item>
      <el-form-item
        :prop="mode === 'Create' ? 'password' : ''"
        label="登录密码"
      >
        <el-input
          v-model="form.password"
          placeholder="登录密码"
          type="password"
        />
      </el-form-item>
      <el-form-item
        :prop="mode === 'Create' ? 'password_repeat' : ''"
        label="确认密码"
      >
        <el-input
          v-model="form.password_repeat"
          placeholder="确认密码"
          autocomplete="new-password"
          type="password"
        />
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="mobile"
      >
        <el-input
          v-model="form.mobile"
          placeholder="手机号"
        />
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="form.email"
          placeholder="邮箱"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          placeholder="备注"
        />
      </el-form-item>
      <el-form-item
        label="所属组织"
        prop="remark"
      >
        <!-- <yd-form-select
          :selects="selectGroup"
          v-model="form.group_id"
          filterable
          style="width: 300px"
        /> -->
        <el-cascader
          v-model="form.group_id"
          :options="treeData"
          :props="{
            value: 'id',
            label: 'group_name',
            expandTrigger: 'hover'
          }"
          change-on-select
          style="width: 280px"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import accessMixins from '../../../mixins/access'

export default createDialog({
  mixins: [accessMixins],

  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const isNumber = /[0-9]/.test(value)
        const isA = /[a-z]/.test(value)
        const isAA = /[A-Z]/.test(value)

        const atternReg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
        const isPattern = atternReg.test(value)

        const regList = [isNumber, isA, isAA, isPattern]
        const level = regList.filter(_ => _).length

        if (level < 2) {
          callback(new Error('6-20位，含大写字母、小写字母、数字、标点中的两种'))
        }
        if (this.form.password_repeat !== '') {
          this.$refs.Form.validateField('password_repeat')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      mode: 'Create',
      id: '',
      treeData: [],
      formDefault: {
        user_name: '',
        password: '',
        password_repeat: '',
        mobile: '',
        email: '',
        remark: '',
        group_id: ''
      },
      rules: {
        user_name: [
          {
            required: true,
            message: '请输入子账号名称',
            trigger: 'blur'
          },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            validator: validatePass,
            trigger: 'blur'
          },
          {
            min: 6, max: 20, message: '6-20位，含大写字母、小写字母、数字、标点中的两种'
          }
        ],
        password_repeat: {
          required: true,
          validator: validatePass2,
          trigger: 'blur'
        },
        mobile: {
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        email: {
          type: 'email',
          message: '邮箱不正确',
          trigger: 'blur'
        }

      }
    }
  },

  methods: {
    async fetchTree() {
      const { list = [] } = await this.Fetch.get('V4/permission.get.subUserGroupTree')
      // if (list.length) {
      //   this.form.parent_group_id = [list[0].id]
      // } else {
      //   this.form.parent_group_id = 0
      // }

      this.treeData = list
    },

    async beforeOpen(form) {
      this.mode = form.id ? 'Edit' : 'Create'
      this.id = form.id
      if (this.mode === 'Edit') {
        delete form.password
        if (form.group_list && form.group_list.length) form.group_id = form.group_list[0].id
      }
      this.fetchTree()
    },

    async initOptions() {
      this.$refs.Form.clearValidate()
    },

    async fetchSubmit() {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })
      const form = {
        ...this.form
      }

      const group_id = form.group_id

      form.group_id = [(Array.isArray(group_id) && group_id.length) ? group_id[group_id.length - 1] : group_id]

      if (this.mode === 'Create') {
        try {
          await this.Fetch.post('V4/permission.add.subUser', form)
        } catch (e) {
          if (e.status.code === 142007) {
            const h = this.$createElement
            this.$message({
              message: h('p', null, [
                h('span', null, '请先完成'),
                h('a', { attrs: { href: '/console/user-center/authentication' }}, '用户认证')
              ]),
              type: 'warning'
            })
          }

          throw new Error()
        }
      } else {
        form.id = this.id
        await this.Fetch.put('V4/permission.edit.subUser', form)
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
