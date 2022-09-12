<template>
  <console-page-layout>
    <el-row :gutter="12">
      <el-col :span="12">
        <DmCard title="安全评分">
          <!--  -->
        </DmCard>
      </el-col>
      <el-col :span="12">
        <DmCard title="资产总览">
          <!--  -->
          <el-row>
            <el-col :span="12">
              <ItemNumber
                value="34"
                title="资产总数"
              />
            </el-col>
            <el-col :span="12">
              <ItemNumber
                value="34"
                title="未认证数"
              />
            </el-col>
          </el-row>
          <el-row class="margin-top">
            <el-col :span="12">
              <ItemNumber
                value="34"
                title="存在漏洞资产数"
              />
            </el-col>
            <el-col :span="12">
              <ItemNumber
                value="34"
                title="存在安全风险资产数"
              />
            </el-col>
          </el-row>
        </DmCard>
      </el-col>
    </el-row>
    <el-row :gutter="12" class="margin-top">
      <el-col :span="12">
        <DmCard title="未完成处置漏洞">
          <!--  -->
        </DmCard>
      </el-col>
      <el-col :span="12">
        <DmCard title="未完成处置内容安全">
          <!--  -->
        </DmCard>
      </el-col>
    </el-row>
    <el-row :gutter="12" class="margin-top">
      <el-col :span="12">
        <DmCard title="漏洞趋势">
          <!--  -->
        </DmCard>
      </el-col>
      <el-col :span="12">
        <DmCard title="内容安全趋势">
          <!--  -->
        </DmCard>
      </el-col>
    </el-row>
  </console-page-layout>
</template>

<script>
import ItemNumber from '@/components/Item/ItemNumber'

export default {
  components: { ItemNumber },

  props: {},

  data() {
    return {}
  },

  computed: {},

  methods: {}
}
</script>
