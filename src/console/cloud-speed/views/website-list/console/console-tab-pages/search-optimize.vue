<template>
  <yd-card
    horizontal
    title="搜索引擎优化"
  >
    <template slot="tips">
      <template v-if="useCname">
        请前往 <a :href="cloudResolveUrl">DNS安全加速</a> 添加搜索引擎线路
      </template>
      <template v-else>
        指定IP让蜘蛛爬取，提高搜索引擎检索效率
      </template>
    </template>
    <SelectSwitch
      v-if="!useCname"
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="fetchUpdate()"
    />
    <DmAlert>
      直接使用源IP作为搜索引擎回源IP会存在源IP暴露的风险，请谨慎使用
    </DmAlert>
    <el-form
      v-if="!useCname"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="搜索引擎回源IP">
        <InputMultiple
          v-model="form.back_source_ips"
          style="display: inline-block; width: 280px; margin-right: 10px"
          placeholder="0.0.0.0"
        />
        <el-button
          type="primary"
          @click="fetchUpdate()"
        >更新</el-button>
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import InputMultiple from '@/components/Input/InputMultiple'
import panelMixins from '../panelMixins'

export default {
  name: 'SearchOptimize',

  components: {
    SelectSwitch,
    InputMultiple
  },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'search_engine_optimization',
      formDefault: {
        status: 'off',
        back_source_ips: []
      }
    }
  },

  computed: {
    useCname() {
      return this.domainInfo.protected_mode === '2'
    },

    cloudResolveUrl() {
      const { cloud_dns_domain_id, member_id } = this.domainInfo
      return `/console/cloud-resolving#/domainList/console/${cloud_dns_domain_id}/${member_id}/record`
    }
  }
}
</script>
