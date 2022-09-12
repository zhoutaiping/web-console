<template>
  <div>
    <DmToolbar>
      <el-dropdown @command="handleAction">
        <el-button type="primary">
          关联策略<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="bind">直接关联</el-dropdown-item>
          <el-dropdown-item command="group">加入分组随分组策略</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <template slot="right">
        <yd-form-select
          :selects="selectBelongType"
          v-model="bindParams.belong_type"
          style="width: 180px"
          default-text="关联类型"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.strategy_name"
          placeholder="策略名称"
          @submit="handleSearch"
        />
      </template>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            label="策略名"
            min-width="150"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: scope.row.strategy_type === 'custom' ? 'access-management.router.privileges__custom__id' : 'access-management.router.privileges__system__id',
                  params: {id :scope.row.strategy_id}
              }">
                {{ scope.row.strategy_name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="关联类型"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ BELONG_TYPE[scope.row.belong_type] }}
            </template>
          </el-table-column>
          <el-table-column
            label="关联时间"
            prop="created_at"
            min-width="150"
          />
          <el-table-column
            label="操作"
            prop="created_at"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleUnBind(scope.row)"
              >
                解除关联
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogPrivilege
      ref="DialogPrivilege"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogPrivilege from '../../groups/components/DialogPrivilege'

export default {
  components: { DialogPrivilege },

  mixins: [consoleData],

  data() {
    return {
      BELONG_TYPE: {
        group: '随组关联',
        user: '直接关联'
      },
      selectBelongType: [
        {
          label: '直接关联',
          value: 'user'
        },
        {
          label: '随组关联',
          value: 'group'
        }
      ],
      API_INDEX: 'V4/permission.strategy.get_binds',
      bindParams: {
        subuser_id: this.$route.params.id,
        belong_type: '',
        strategy_name: ''
      }
    }
  },

  methods: {
    handleBind() {
      this.$refs.DialogPrivilege.handleOpen({
        belong_type: 'user',
        belong_ids: [this.$route.params.id]
      })
    },

    handleAction(cmd) {
      if (cmd === 'bind') {
        this.handleBind()
      } else if (cmd === 'group') {
        this.$emit('action-group')
      }
    },

    async handleUnBind(row) {
      try {
        await this.Fetch.post('V4/permission.strategy.bind', {
          action: 'unbind',
          belong_type: row.belong_type,
          belong_ids: [row.belong_id],
          strategy_ids: [row.strategy_id]
        })
      } catch (e) {
        return
      }
      this.fetchList()
      this.Message('ACTION_SUCCESS')
    }
  }
}
</script>
