<style lang="scss">
.ColumnInsertMode {
  &__popper {
    font-size: 12px;

    .tips {
      margin-top: 10px;
    }
  }

  &__copy {
    font-size: 13px;
    margin-left: 4px;
  }
}
</style>

<template>
  <div :class="b()">
    <el-radio-group
      v-model="row.protected_mode"
      @change="handleSelectMode(row)"
    >
      <el-popover
        :popper-class="b('popper')"
        trigger="hover"
        placement="top"
        title="CNAME接入"
      >
        <template v-if="row.status !== '1'">
          需先待网站审核通过
        </template>
        <div
          v-loading="loading"
          v-else
        >
          <div>
            <StatusAccess :success="Number(row.use_yundun_cname) === 1" />
            <a
              type="text"
              @click="clickJoin(row)"
            >刷新</a>
          </div>
          <p class="tips">
            <template v-if="Number(row.use_yundun_cname) === 0">
              请前往该域名解析管理处添加指定CNAME记录
            </template>
          </p>
        </div>
        <el-radio
          slot="reference"
          :disabled="row.status !== '1'"
          label="1"
        >
          CNAME
        </el-radio>
      </el-popover>
      <!-- 复制CNAME -->
      <el-popover
        :popper-class="b('popper')"
        title="复制CNAME"
        trigger="hover"
        placement="top"
      >
        <a @click="copyAliasName(row.cname)">
          {{ row.cname }}
        </a>
        <a
          slot="reference"
          :disabled="row.status !== '1'"
          :class="b('copy')"
          class="el-icon-copy-document"
          @click="copyAliasName(row.cname)"
        />
      </el-popover>
      <!-- 部分平台不支持 NS 接入 -->
      <template v-if="moduleSettings['cloud-speed'].supportNS">
        <el-popover
          :popper-class="b('popper')"
          title="NS接入"
          trigger="hover"
          placement="top"
        >
          <template>
            <StatusAccess :success="row.use_yundun_dns === '1'" />
            <template v-if="row.status !== '1' && row.use_yundun !== 1">
              <p class="tips">需先待网站审核通过，并使用<a href="cloud-resolving#/domainList">DNS安全加速</a>且已添加A记录</p>
            </template>
            <template v-if="row.status === '1' && row.use_yundun !== 1">
              <p class="tips">需先使用<a href="cloud-resolving#/domainList">DNS安全加速</a>且已添加A记录</p>
            </template>
            <template v-if="row.status !== '1' && row.use_yundun === 1">
              <p class="tips">需先待网站审核通过</p>
            </template>
          </template>
          <el-radio
            slot="reference"
            :disabled="row.use_yundun_dns !== '1' || row.status !== '1'"
            style="margin-left: 16px"
            label="2"
          >NS</el-radio>
        </el-popover>
      </template>
    </el-radio-group>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import column from '@/mixins/column'
import StatusAccess from './StatusAccess'

export default create({
  name: 'ColumnInsertMode',

  components: { StatusAccess },

  mixins: [column],

  data() {
    return {
      loading: false
    }
  },

  methods: {
    // cname&&cloudresolve
    async handleSelectMode(row) {
      const params = {
        domain_id: row.id,
        protected_mode: row.protected_mode,
        protected_status: row.protected_status
      }

      try {
        await this.Fetch.put('V4/Web.Domain.Open.Close.Protect', params)
      } catch (e) {
        row.protected_mode = row.protected_mode === '1' ? '2' : '1'
        return
      }

      this.Message('ACTION_SUCCESS')
      this.$emit('init')
    },

    copyAliasName(text) {
      if (!text) return
      this.Help.copyText(text)
      this.$message.success('复制成功')
    },

    async clickJoin(row) {
      this.loading = true
      const params = {
        domain_id: row.id
      }
      let data
      try {
        data = await this.Fetch.get('V4/Web.Domain.check.cname.use.yundun', params)
      } catch (e) {
        return
      } finally {
        this.loading = false
      }
      const item = data[row.domain]
      item && (row.use_yundun_cname = Number(item.use_yundun))
    }
  }
})
</script>
