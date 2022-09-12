<template>
  <yd-card
    horizontal
    title="防敏感信息泄露"
  >
    <template slot="tips">
      <p>针对网站页面中出现的个人隐私敏感数据进行检测识别，并提供预警和屏蔽敏感信息等防护措施，避免网站经营数据泄露。</p>
    </template>
    <yd-form-select
      slot="action"
      :selects="options"
    />
    <TableEdit
      :delete-row="handleDeleteRow"
      edit-inline
    >
      <el-table-column label="匹配类型">
        <template>
          敏感信息过滤
        </template>
      </el-table-column>
      <el-table-column label="匹配路径">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.$edit"
            v-model="scope.row.route"
            placeholder="以 / 开头"
          />
          <template v-else>
            {{ scope.row.route }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="匹配内容">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.$edit"
            v-model="scope.row.content"
            placeholder="匹配内容"
          />
          <template v-else>
            {{ scope.row.content }}
          </template>
        </template>
      </el-table-column>
    </TableEdit>
  </yd-card>
</template>

<script>
import create from '@/utils/create-basic'
import TableEdit from '@/components/Table/TableEdit'

export default create({
  name: 'CardSensitive',

  components: {
    TableEdit
  },

  data() {
    return {
      options: [
        {
          label: 'ON',
          value: 'on'
        },
        {
          label: 'OFF',
          value: 'off'
        }
      ]
    }
  },

  methods: {
    handleDeleteRow(scope) {
    }
  }
})
</script>
