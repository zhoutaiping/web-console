<template>
  <!-- 高级缓存 -->
  <CardItemForm
    :loading="firstLoading"
    horizontal
    title="高级缓存"
    is-support
    is-init
  >
    <template slot="tips">{{ appAssets.companyEN }} 优质节点网络，智能缓存网站内容极大提高网站访问速度</template>
    <SelectSwitch
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="fetchUpdate()"
    />
    <yd-alert>
      <p>1. 若您需配置的缓存类型不在我们的列表中，可以手动添加，以“|”分割</p>
      <p>2. 缓存类型为目录或者精确匹配时以“／”开头</p>
      <p>3. 支持自行调控优先级，不缓存记录优先级高于缓存记录</p>
      <p>4. 开启缓存功能后，系统默认忽略请求头中 Cache-Control 和 Pragma 两个头部不走缓存信息，只要节点有缓存就不会到源取数据，仍然返回缓存内容</p>
      <p>5. 缓存时间最长一年，缓存/不缓存分别能添加 200 条</p>
      <p>6. 游客缓存可以提升未登录用户的访问速度，若您的业务登录后用Cookie标识访客的，可对此Cookie键配置游客缓存，不包含此Cookie键的内容将被缓存</p>
    </yd-alert>
    <TableCdnCache
      ref="list"
      :list.sync="list"
      :loading="loading"
      @save-row="handleCdnCacheRuleSave"
      @delete-row="handleConfDel"
      @change-type="handleChangeType"
      @on-up="ruleUp"
      @on-down="ruleDown"
    />
    <el-form
      v-show="selectCacheType === 'yes'"
      class="margin-top"
    >
      <el-form-item>
        <el-checkbox
          v-model="form.ctrl_f5_refresh"
          :true-label="0"
          :false-label="1"
          @change="fetchUpdate()"
        >忽略请求头中 Cache-Control 和 Pragma</el-checkbox>
        <TipsTooltip title="忽略本请求头在有缓存的情况下使用缓存响应，而不向源服务器请求" />
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="form.ignore_scheme"
          :true-label="1"
          :false-label="0"
          @change="fetchUpdate()"
        >HTTP / HTTPS 缓存共用</el-checkbox>
        <TipsTooltip title="同一份资源文件，HTTP 和 HTTPS 下共用缓存，可提升缓存命中率" />
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="form.ignore_args"
          :true-label="1"
          :false-label="0"
          @change="fetchUpdate()"
        >缓存时忽略URL中的参数</el-checkbox>
        <TipsTooltip title="控制缓存时是否忽略用户请求URL中问号之后的参数，默认情况下不会忽略“?”之后的参数" />
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="form.sort_args"
          :true-label="1"
          :false-label="0"
          @change="fetchUpdate()"
        >参数顺序识别</el-checkbox>
        <TipsTooltip title="可将URL中参数相同，但是顺序不同的资源内容，忽略参数的排序，只缓存一份，可有效提高缓存命中率" />
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="form.upstream_cache_control_first"
          :true-label="1"
          :false-label="0"
          @change="fetchUpdate()"
        >遵循源站响应头部缓存规则</el-checkbox>
        <TipsTooltip title="客户端缓存时间遵循源站设置的生效时长" />
      </el-form-item>
    </el-form>
  </CardItemForm>
</template>

<script>
import TipsTooltip from '@/components/Tips/TipsTooltip'
import SelectSwitch from '@/components/Select/SelectSwitch'
import TableCdnCache from '../../../../components/TableCdnCache'
import panelMixins from '../panelMixins'

export default {
  name: 'CdnChache',

  components: {
    TipsTooltip,
    TableCdnCache,
    SelectSwitch
  },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'cdn_advance_cache',
      loading: true,
      firstLoading: true,
      list: [],
      formDefault: {
        ctrl_f5_refresh: 0,
        ignore_args: 0,
        ignore_scheme: 0,
        sort_args: 0,
        upstream_cache_control_first: 0,
        status: 'on'
      },
      selectCacheType: 'yes'
    }
  },

  mounted() {
    this.fetchCdnAdvanceCacheRules()
  },

  methods: {
    formatSettings(data) {
      data.ctrl_f5_refresh = Number(data.ctrl_f5_refresh)
      data.ignore_args = Number(data.ignore_args)
      data.ignore_scheme = Number(data.ignore_scheme)
      data.sort_args = Number(data.sort_args)
      return data
    },

    handleChangeType(type) {
      this.selectCacheType = type
      this.list = []
      this.fetchCdnAdvanceCacheRules()
    },

    formatList(list) {
      list.forEach(item => {
        item.$edit = false
        Object.assign(item, item.value)
      })
      return list
    },

    async fetchCdnAdvanceCacheRules() {
      this.loading = true
      const result = await this.Fetch.get('V4/web.domain.set.get.rule', {
        domain_id: this.domainId,
        group: 'cdn_advance_cache'
      })
      const data = result.cdn_advance_cache

      if (this.selectCacheType === 'yes') {
        this.list = this.formatList(data.cache_list)
      } else {
        this.list = this.formatList(data.nocache_list)
      }
      this.loading = false
      this.firstLoading = false
    },

    async handleCdnCacheRuleSave({ row }) {
      await this.confirmAction()
      this.loading = true
      const params = {
        domain_id: this.domainId,
        group: {
          cdn_advance_cache: {
            type: row.type,
            content: row.content,
            cache_type: this.selectCacheType,
            cache_time_unit: row.cache_time_unit,
            cache_time: row.cache_time,
            id: row.id
          }
        }
      }

      try {
        await this.Fetch.post(`V4/web.domain.set.save.rule`, params)
      } catch (e) {
        return
      } finally {
        row.$edit = false
        this.loading = false
      }
      this.Message('ACTION_SUCCESS')
      this.fetchCdnAdvanceCacheRules()
    },

    changeCacheType(type) {
      this.errorTip = false
      this.fetchCdnAdvanceCacheRules()
    },

    async handleConfDel({ $index, row }) {
      await this.confirmAction()
      const params = {
        domain_id: this.domainId,
        group: {
          cdn_advance_cache: {
            id: row.id
          }
        }
      }
      try {
        await this.Fetch.delete('V4/web.domain.set.del.rule', params)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchCdnAdvanceCacheRules()
    },

    async ruleUp(scope) {
      await this.confirmAction()
      if (scope.$index === 0) return
      this.swapItems(
        this.list,
        scope.$index,
        scope.$index - 1
      )
    },

    async ruleDown(scope) {
      await this.confirmAction()
      if (scope.$index === this.list.length - 1) return
      this.swapItems(
        this.list,
        scope.$index,
        scope.$index + 1
      )
    },

    swapItems(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return this.fetchSort(arr)
    },

    async fetchSort(arr) {
      await this.confirmAction()
      const jsonIds = {}
      arr.forEach((item, index) => {
        jsonIds[item.id] = index
        item.order = index
      })

      const params = {
        domain_id: this.domainId,
        ids: jsonIds
      }

      try {
        await this.Fetch.put(`V4/Web.Domain.DomainId.Settings.setCacheOrder`, params)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      return arr
    }
  }
}
</script>
