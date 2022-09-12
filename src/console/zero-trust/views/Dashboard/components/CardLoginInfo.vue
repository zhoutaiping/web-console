<template>
  <DmCard
    title="登录情况"
    class="CardLoginInfo"
    style="height: 450px"
  >
    <ItemNumberLite
      title="登录总次数"
      column
      border
    >
      {{ data.login_total_times || 0 }}
    </ItemNumberLite>

    <div style="padding-top: 30px">
      <el-row :gutter="12">
        <el-col :span="12" style="border-right: 1px solid #eee">
          <ItemNumberLite
            title="访问应用总请求数："
          >
            {{ data.access_total_times || 0 }}
          </ItemNumberLite>
          <ItemNumberLite
            title="放行请求数："
          >
            {{ data.access_allow_times || 0 }}
          </ItemNumberLite>
          <ItemNumberLite
            title="绕过请求数："
          >
            {{ data.access_bypass_times || 0 }}
          </ItemNumberLite>
          <ItemNumberLite
            title="拒绝请求数："
          >
            {{ data.access_deny_times || 0 }}
          </ItemNumberLite>
        </el-col>
        <el-col :span="12">
          <ItemNumberLite
            title="登录失败次数："
          >
            {{ data.login_fail_total || 0 }}
          </ItemNumberLite>
          <ItemNumberLite
            title="第三方IDP登录失败次数："
          >
            {{ data.login_fail_idp || 0 }}
          </ItemNumberLite>
          <ItemNumberLite
            title="云AD登录失败次数："
          >
            {{ data.login_fail_ad || 0 }}
          </ItemNumberLite>
        </el-col>
      </el-row>
    </div>
  </DmCard>
</template>

<script>
import ItemNumberLite from '@/components/Item/ItemNumberLite'

export default {
  components: { ItemNumberLite },

  props: {
    data: Object
  },

  data() {
    return {
    }
  },

  computed: {},

  methods: {}
}
</script>
