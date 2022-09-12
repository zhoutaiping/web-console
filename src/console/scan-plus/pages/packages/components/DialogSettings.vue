<template>
  <yd-dialog
    :visible.sync="visible"
    aside
    aside-type="top"
    title="配置"
    width="600px"
    @close="handleClose"
    @submit="handleClose"
  >
    <yd-alert class="margin-top">
      资产为资产管理中通过认证的资产（域名／IP）。<br>
      当前套餐可绑定资产（共 {{ info.property_num }} 条，剩余可绑定资产 {{ info.last_property_num }} 条）
    </yd-alert>
    <el-form>
      <el-form-item>
        <DmTable
          :loading="loadingPackagesProperty"
          border
        >
          <el-table :data="propertyList">
            <el-table-column
              label="已绑定资产"
              prop="property_object"
            />
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleUnbind(scope.row)"
                >解绑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </el-form-item>
      <el-form-item>
        <yd-form-select
          v-model="form.property_ids"
          :selects="selectProperty"
          multiple
          collapse-tags
          style="width: 250px; margin-right: 8px"
        />
        <el-button
          :loading="loadingBindBtn"
          :disabled="!form.property_ids"
          type="primary"
          @click="handleBind"
        >绑定</el-button>
      </el-form-item>
    </el-form>
  </yd-dialog>
</template>

<script>
import dialogBase from '@/mixins/dialogBase'

export default {
  mixins: [dialogBase],

  data() {
    return {
      package_id: '',
      selectProperty: [],
      propertyList: [],
      loadingPackagesProperty: true,
      loadingBindBtn: false,
      isChange: false,
      info: {},
      form: {
        property_ids: []
      }
    }
  },

  methods: {
    handleClose() {
      this.isChange && this.$emit('init')
    },

    init() {
      this.form.property_ids = []
      this.fetchPropertyList()
      this.fetchPackagesProperty()
    },
    // 读取未绑定套餐的资产
    async fetchPropertyList() {
      const data = await this.Fetch.post('V4/smgc.property.all.usable.list')
      this.selectProperty = data.list.map(item => {
        return {
          label: `${item.property_name} [${item.property_object}]`,
          value: item.id
        }
      })
    },
    // 读取套餐已绑定的资产
    async fetchPackagesProperty() {
      this.loadingPackagesProperty = true
      const params = {
        package_id: this.package_id,
        per_page: 999
      }
      const data = await this.Fetch.post('V4/smgc.package.property.list', params)
      this.propertyList = data.list
      this.info = data.package_info
      this.loadingPackagesProperty = false
    },
    // 解绑资产
    async handleUnbind(row) {
      const form = {
        package_id: this.package_id,
        property_id: row.id
      }
      try {
        await this.Fetch.post('V4/smgc.package.unbind.property', form)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.isChange = true
      this.init()
    },
    // 绑定资产
    async handleBind() {
      this.loadingBindBtn = true
      const form = {
        package_id: this.package_id,
        property_ids: this.form.property_ids
      }
      try {
        await this.Fetch.post('V4/smgc.package.bind.property', form)
      } catch (e) {
        return
      } finally {
        this.loadingBindBtn = false
      }
      this.Message('ACTION_SUCCESS')
      this.isChange = true
      this.init()
    },

    beforeOpen(form) {
      this.package_id = form.id
      this.isChange = false
      this.init()
    }
  }
}
</script>
