<template>
  <console-page-layout>
    <DmAlert>
      <p>1. 创建配置模板后，您可将模板中的防护配置批量绑定至Web安全加速业务中，现有套餐若不支持某功能时，该功能将无法配置</p>
      <p>2. 业务绑定模板后，业务配置将不可回滚，请确认您的配置模板和绑定的业务无误</p>
      <p>3. 业务绑定模板后，您若在网站列表 - 控制台修改防护配置将自动解绑配置模板</p>
    </DmAlert>
    <div v-loading="loading">
      <yd-card>
        <yd-card>
          <el-form
            ref="Form"
            :model="form"
            :rules="rules"
            label-position="left"
            label-width="190px"
          >
            <el-form-item
              label="模板名称"
              prop="name"
            >
              <el-input
                v-model="form.name"
                style="width: 300px"
                placeholder="模板名称"
              />
            </el-form-item>
            <el-form-item
              label="备注"
              prop="remark"
            >
              <el-input
                v-model="form.remark"
                style="width: 300px"
                placeholder="备注"
              />
            </el-form-item>
          </el-form>
        </yd-card>
        <yd-card
          v-for="(item, index) in menus"
          :title="item.title"
          :key="index"
        >
          <yd-table
            :open-min-height="false"
            type="white"
          >
            <el-table :data="item.items">
              <el-table-column
                min-width="150"
                prop="title"
                label="配置项"
              />
              <el-table-column
                min-width="250"
                label="描述"
              >
                <template slot-scope="scope">
                  {{ scope.row.desc | envView }}
                </template>
              </el-table-column>
              <el-table-column
                min-width="150"
                label="配置内容"
              >
                <template slot-scope="scope">
                  <ColumnSettingContent
                    :row="scope.row"
                    :data="setForm[scope.row.key]"
                    :set-form="setForm"
                    :ref="`SettingContent-${scope.row.key}`"
                  />
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button @click="handleOpenSetting(scope.row)">修改配置</el-button>
                </template>
              </el-table-column>
            </el-table>
          </yd-table>
        </yd-card>
        <div style="margin: 30px 20px">
          <el-button
            :loading="submitLoading"
            size="medium"
            type="primary"
            style="margin-right: 12px"
            @click="handleSubmit"
          >保存</el-button>
          <router-link :to="{
              name: 'cloud-speed.router.configTemplates'
          }">
            <el-button size="medium">取消</el-button>
          </router-link>
        </div>
      </yd-card>
    </div>
    <DialogTemplateSettings
      ref="DialogTemplateSettings"
      @submit="handleSubmitSetting"
    />
  </console-page-layout>
</template>

<script>
import ColumnSettingContent from './components/ColumnSettingContent'
import DialogTemplateSettings from '../../components/DialogTemplateSettings'
import MENU from '../../constant/template-menu'
import settingsConfig from '../../constant/settingsConfig'

const KEY_CONTAIN_RULE = ['web_honeypot', 'resp_headers', 'cdn_advance_cache', 'customized_req_headers']

export default {
  components: {
    DialogTemplateSettings,
    ColumnSettingContent
  },

  data() {
    return {
      id: this.$route.params.id,
      loading: false,
      submitLoading: false,
      form: {
        name: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请填写备注', trigger: 'blur' }
        ]
      },
      setForm: {
        access_mode: {},
        source_site_protect: {},
        slice: {},
        WebP: {},
        https: {},
        mobile_jump: {},
        browser_cache: {},
        websocket: {},
        hsts: {},
        protected_status: {},
        cloud_waf: {},
        anti_cc: {},
        waf_block_diy_page: {},
        web_honeypot: {},
        mirror: {},
        web_honeypot_rules: [],
        safe_snap: {},
        anti_refer: {},
        zone_limit: {},
        content_replace: {},
        firewall: {},
        diy_page_404: {},
        diy_page_500: {},
        diy_page_502_or_504: {},
        resp_headers: {},
        resp_headers_rules: [],
        customized_req_headers: {},
        customized_req_headers_rules: [],
        cdn_advance_cache: {},
        cdn_advance_cache_rules: [],
        listen_port: {},
        back_source_sni: {}
      }
    }
  },

  computed: {
    menus() {
      MENU.forEach(item => {
        item.items = item.list.map(name => {
          return {
            name,
            ...this.moduleLabel['cloud-speed'].SETTINS_ITEM[name],
            ...settingsConfig[name]
          }
        })
      })
      return MENU
    }
  },

  mounted() {
    this.id && this.fetchInfo()
  },

  methods: {
    async fetchInfo() {
      this.loading = true
      const params = this.$route.params
      const data = await this.Fetch.post('V4/cdntpl.info', params)
      this.form.name = data.name
      this.form.remark = data.remark
      // mirror + safe_snap
      data.detail.safe_snap = Object.assign(data.detail.safe_snap, data.detail.mirror)
      Object.assign(this.setForm, data.detail)
      this.loading = false
    },

    handleOpenSetting(row) {
      const { key } = row
      let form = {}
      if (KEY_CONTAIN_RULE.includes(key)) {
        form = {
          [key]: this.setForm[key],
          [`${key}_rules`]: this.setForm[`${key}_rules`]
        }
      } else {
        form = this.setForm[key]
      }

      this.$refs.DialogTemplateSettings.handleOpen(form, row)
    },

    handleSubmitSetting(key, form) {
      if (KEY_CONTAIN_RULE.includes(key)) {
        this.setForm[key] = form[key]
        this.setForm[`${key}_rules`] = form[`${key}_rules`]
      } else if (key === 'safe_snap') {
        this.setForm.mirror = form.mirror
        this.setForm.safe_snap = {
          ...form.safe_snap,
          ...form.mirror
        }
      } else {
        this.setForm[key] = form
      }

      this.$refs[`SettingContent-${key}`][0].initView()
    },

    async handleSubmit() {
      this.$refs.Form.validate(async (valid) => {
        if (!valid) return
        const form = {
          id: this.id,
          ...this.form,
          ...this.setForm
        }
        this.submitLoading = true
        try {
          await this.Fetch.post('V4/cdntpl.save', form)
        } catch (e) {
          return
        } finally {
          this.submitLoading = false
        }
        this.$router.push({ name: 'cloud-speed.router.configTemplates' })
        this.Message('ACTION_SUCCESS')
      })
    }
  }
}
</script>
