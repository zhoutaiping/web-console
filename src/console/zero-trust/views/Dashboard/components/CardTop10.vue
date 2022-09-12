<template>
  <DmCard
    :title="title"
    :loading="loading"
    style="height: 450px"
  >
    <DmTable border>
      <el-table
        :data="data"
        :show-header="false"
        :height="tableHeight"
      >
        <el-table-column width="45">
          <template slot-scope="scope">
            <span class="color--primary">{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="170">
          <template slot-scope="scope">
            <div style="display: flex; ">
              <el-avatar
                v-if="scope.row.logo"
                :src="scope.row.logo"
                :size="24"
                style="margin-right: 8px"
              />
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="180"
          align="right"
        >
          <template slot-scope="scope">
            <span class="color--primary">{{ scope.row.value }}</span>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </DmCard>
</template>

<script>
import ItemNumberLite from '@/components/Item/ItemNumberLite'

export default {
  components: { ItemNumberLite },

  props: {
    title: String,
    data: Array,
    loading: Boolean,
    tableHeight: {
      type: Number,
      default: 350
    }
  }
}
</script>
