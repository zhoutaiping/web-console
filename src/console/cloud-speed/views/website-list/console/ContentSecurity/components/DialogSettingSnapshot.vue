<template>
  <DialogForm
    ref="Dialog"
    v-model="form"
    :rules="rules"
    :form-default="formDefault"
    :title="`编辑配置[${form.domain}]`"
    cancel-button-type="text"
    @submit="handleSubmit"
  >
    <DmAlert slot="header">
      <p>1. 起始抓取页面：快照将从您指定的页面开始抓取内容，如果您使用了非80端口，建议您将非80端口的内容主页添加在起始抓取页面中。</p>
      <p>2. 黑名单URL：快照不缓存该URL，用户请求此URL的时候可正常到源取数据。</p>
      <p>3. 不支持添加泛域名如：*.demo.com，一次输入域名上限20条。</p>
      <p v-if="moduleSettings['cloud-speed'].supportNS">4. 您的域名接入{{ appAssets.companyEN }} DNS安全加速之后，将会获得更好的备份效果。</p>
    </DmAlert>
    <el-form-item
      label="快照名称"
      prop="name"
    >
      <el-input
        v-model="form.name"
        :disabled="form.type === 0"
        style="width: 200px"
        placeholder="快照名称"
      />
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        v-model="form.comment"
        style="width: 200px"
        placeholder="备注"
      />
    </el-form-item>
    <el-form-item label="备份内容">
      <yd-form-radio
        :radios="BACKUPS_TYPE"
        v-model="form.backup_content"
      />
    </el-form-item>
    <el-form-item label="浏览器渲染抓取">
      <el-switch
        :active-value="1"
        :inactive-value="0"
        v-model="form.limit_js"
        style="margin-right: 12px"
      />
      <TipsTooltip>需要网站支持浏览器渲染，开启后爬虫会以 JS 方式抓取，但需明白，开启后会加大整体爬取时长</TipsTooltip>
    </el-form-item>
    <el-form-item
      v-if="form.type === 0"
      label="更新间隔"
    >
      <template v-if="!form.has_remain">
        <el-tooltip placement="top">
          <div slot="content">
            网站快照使用容量已超出购买额度，请联系商务进行扩容
          </div>
          <yd-form-select
            :disabled="!form.has_remain"
            :selects="selectRegularUpdate"
            v-model="form.regular_update"
          />
        </el-tooltip>

      </template>
      <template v-else>
        <yd-form-select
          :selects="selectRegularUpdate"
          v-model="form.regular_update"
        />
      </template>
    </el-form-item>
    <el-form-item label="起始抓取页面">
      <el-button
        type="primary"
        style="margin-bottom: 12px"
        @click="handleAddRow(INITIAL_FETCH_ROW, form.initial_fetch_table)"
      >新增</el-button>
      <DmTable border>
        <el-table :data="form.initial_fetch_table">
          <el-table-column
            label="URL(请输入该域名下的URL，且以http(s)://开头)"
            min-width="200"
          >
            <template slot-scope="scope">
              <ColumnForm
                ref="table-url"
                :rules="tableRules"
                :model="scope.row"
                prop="url"
              >
                <el-input v-model="scope.row.url" />
              </ColumnForm>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            align="right"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  type="text"
                  @click="handleDeleteRow(scope, form.initial_fetch_table)"
                >删除</el-button>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </el-form-item>
    <el-form-item label="黑名单URL">
      <el-button
        type="primary"
        style="margin-bottom: 12px"
        @click="handleAddRow(BLACK_URLS_ROW, form.black_urls)"
      >新增</el-button>
      <DmTable border>
        <el-table :data="form.black_urls">
          <el-table-column
            label="URL(请输入该域名下的URL，且以http(s)://开头)"
            min-width="200"
          >
            <template slot-scope="scope">
              <ColumnForm
                ref="table-url2"
                :rules="tableRules"
                :model="scope.row"
                prop="url"
              >
                <el-input v-model="scope.row.url" />
              </ColumnForm>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            align="right"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  type="text"
                  @click="handleDeleteRow(scope, form.black_urls)"
                >删除</el-button>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </el-form-item>
  </DialogForm>
</template>

<script>
import RULE from '@/utils/verify'
import createDialog from '@/utils/createDialog'
import { deepClone } from '@/utils'
import { validator } from '@/utils/form'
import ColumnForm from '@/components/Column/ColumnForm'

const BACKUPS_TYPE = [
  {
    label: '首页',
    value: 0
  },
  {
    label: '全站',
    value: 1
  }
]

const selectRegularUpdate = [
  {
    label: '12小时',
    value: 12
  },
  {
    label: '1天',
    value: 24
  },
  {
    label: '不更新',
    value: 0
  }
]

const BLACK_URLS_ROW = {
  url: ''
}

const INITIAL_FETCH_ROW = {
  url: ''
  // port: ''
}

export default createDialog({
  components: { ColumnForm },

  data() {
    return {
      INITIAL_FETCH_ROW,
      BLACK_URLS_ROW,
      BACKUPS_TYPE,
      selectRegularUpdate,
      rules: {
        name: { required: true, message: '请填写快照名称' }
      },
      tableRules: {
        url: { validator: validator(RULE.defaultUrl, '格式有误') }
      },
      formDefault: {
        name: '',
        comment: '',
        backup_content: 0,
        limit_js: 0,
        black_urls: [],
        domain: '',
        id: '',
        initial_fetch_table: [],
        regular_update: 0
      },
      form: {}
    }
  },

  methods: {
    handleDeleteRow(scope, table) {
      table.splice(scope.$index, 1)
    },

    checkItem(key) {
      const refs = this.$refs[`table-${key}`]
      if (refs && !refs.every(_ => _.validate())) {
        return false
      } else {
        return true
      }
    },

    async handleAddRow(row, table) {
      table.push(deepClone(row))
    },

    beforeSubmit() {
      ['url'].every(_ => this.checkItem(_.value))
      return
    },

    async handleSubmit() {
      const form = {
        ...this.form
      }
      form.initial_fetch_urls = form.initial_fetch_table.map(_ => _.url)
      form.black_urls = form.black_urls.map(_ => _.url)

      try {
        await this.Fetch.post('V4/replaceMirror.mirror.configure', form)
      } catch (e) {
        this.resetSubmitLoading()
        return
      }
      this.Message('ACTION_SUCCESS')
      this.handleClose()
      this.$emit('init')
    }
  }
})
</script>
