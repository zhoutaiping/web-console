<template>
  <div>
    <DmTable
      add-button
      border
      @click-add-button="handleRowAdd"
    >
      <el-table
        :data="list"
        :show-header="false">
        <el-table-column
          label="匹配类型"
          min-width="140"
        >
          <template slot-scope="scope">
            <yd-form-select
              :selects="selects.filter(_ => !list.map(_ => _.key).includes(_.value))"
              v-model="scope.row.key"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="匹配类型"
          min-width="200"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.value"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="40px"
        >
          <template slot-scope="scope">
            <a
              style="font-size: 14px"
              class="el-icon-remove"
              @click="handleRowDelete(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </div>
</template>

<script>
import consoleTable from '@/mixins/consoleTable'

function isObjectValueEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a)
  var bProps = Object.getOwnPropertyNames(b)

  if (aProps.length !== bProps.length) {
    return false
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]
    var propA = a[propName]
    var propB = b[propName]
    if (propA !== propB) {
      return false
    }
  }
  return true
}

export default {
  mixins: [consoleTable],

  props: {
    selects: Array,
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {
      rowKey: [],
      list: [],
      row: {
        key: '',
        value: ''
      }
    }
  },

  watch: {
    value(value) {
      this.setList(value)
    },

    list: {
      deep: true,
      handler() {
        this.getList()
      }
    }
  },

  created() {
    this.setList(this.value)
  },

  methods: {
    setList(data) {
      const list = []
      Object.keys(data).forEach(key => {
        list.push({
          key,
          value: data[key]
        })
      })
      this.list = list
    },

    getList() {
      const data = {}
      this.list.forEach(item => {
        data[item.key] = item.value
      })

      if (!isObjectValueEqual(JSON.parse(JSON.stringify(data)), JSON.parse(JSON.stringify(this.value)))) {
        this.$emit('input', data)
      }
    }
  }
}
</script>
