<template>
  <div>
    <yd-alert>
      <p>提前将需要缓存的资源预热到节点上，提升缓存命中率和请求速度</p>
      <p>1. 请输入具体域名 URL，以 http(s):// 开始，多个 URL 请用回车分隔</p>
      <p>2. 缓存预热仅支持已审核通过域名的URL，暂不支持泛域名URL</p>
      <p>3. 缓存预热需遵循缓存配置，不匹配缓存策略的 URL 以及非本账号下的 URL 将被忽略</p>
      <p>4. 单账号每分钟仅支持添加2次缓存预热任务，单次最多支持200个URL，且重复的URL将被忽略</p>
    </yd-alert>
    <yd-card
      class="margin-top"
      grey
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item prop="preheat_url">
          <el-input
            :rows="10"
            v-model="form.preheat_url"
            type="textarea"
            placeholder="请输入需要缓存预热的 URL"
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
    <DialogTips ref="DialogTips"/>
  </div>
</template>

<script>
import DialogTips from './components/DialogTips'

export default {
  components: { DialogTips },

  data() {
    return {
      loadingSubmit: false,
      form: {
        preheat_url: ''
      },
      formRules: {
        preheat_url: [
          { required: true, trigger: 'blur', message: '请填写URL' }
        ]
      }
    }
  },

  created() {
    this.init()
  },

  methods: {
    async init() {
      const data = await this.Fetch.get('V4/Web.Domain.DashBoard.get.preheat.cache.list')
      const { preheat_url = [] } = data
      this.form.preheat_url = preheat_url.join('\n')
    },

    async handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return

        const form = {
          preheat_url: this.form.preheat_url.split(/[\n\r]/g).filter(_ => _)
        }

        this.loadingSubmit = true
        let res
        try {
          res = await this.Fetch.post('/V4/Web.Domain.DashBoard.save.preheat.cache', form)
        } catch (e) {
          return
        } finally {
          this.loadingSubmit = false
        }

        const { error_url = [] } = res
        if (error_url && error_url.length) {
          this.$refs.DialogTips.handleOpen({ list: error_url })
          return
          // this.$message.error(`预热失败URL：${error_url.join(', ')} `)
        } else {
          this.Message('ACTION_SUCCESS')
        }

        this.init()
      })
    }
  }
}
</script>
