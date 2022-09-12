<template>
  <ConsolePageLayout>
    <yd-alert>
      删除域名前，请先解除与TCP安全加速套餐的绑定关系
    </yd-alert>
    <yd-card-list style="margin-top: 12px">
      <yd-card>
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          label-width="130px"
        >
          <el-form-item
            label="网站列表"
            prop="domains"
          >
            <el-input
              :rows="10"
              v-model="form.domains"
              type="textarea"
              placeholder="请使用回车分割多个网站，一次最多100个网站"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loadingSubmit"
              style="width: 100px"
              type="primary"
              @click="handleSubmit"
            >提交</el-button>
          </el-form-item>
        </el-form>
      </yd-card>
    </yd-card-list>
  </ConsolePageLayout>
</template>

<script>
import RULE from '@/utils/verify'

function urlVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    value = value.split(/[\n\r]/g)
    value = value.filter(_ => _)
  } else {
    if (!value[0]) callback(new Error('请填写'))
  }

  value.forEach(item => {
    if (!RULE.domainWithPan.test(item)) {
      callback(new Error('格式有误'))
    }
  })
  callback()
}

export default {
  data() {
    return {
      list: [],
      loadingSubmit: false,
      form: {
        domains: ''
      },
      formRules: {
        domains: [
          { required: true, trigger: 'blur', message: '请填写域名' },
          {
            validator: urlVaildate,
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    async handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          this.loadingSubmit = true
          try {
            await this.Fetch.delete('V4/Web.Domain.remove', {
              domains: this.form.domains.split(/[\n\r]/g).filter(Boolean)
            })
          } catch (e) {
            return
          } finally {
            this.loadingSubmit = false
          }
          this.Message('ACTION_SUCCESS')
          this.form.domains = ''
        })
      })
    }
  }
}
</script>
