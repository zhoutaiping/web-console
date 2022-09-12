<style lang="scss">
.ItemIcon {
  cursor: pointer;
  margin-right: 20px;
}
</style>

<template>
  <div>
    <CardItemForm
      v-loading="loading"
      :loading="false"
      is-init
      element-loading-spinner="el-icon-loading"
      is-support
      title="集成第三方身份数据源IDP"
    >
      <DmAlert>
        当且仅当仅集成的IDP支持配置跳过单点登录页面时，直接跳转至账号供应商登录页面，否则此功能不生效
      </DmAlert>
      <el-form label-position="top">
        <el-form-item label="已集成">
          <div
            v-for="(item, index) in list"
            :key="index"
            style="display: inline-block; margin-right: 20px; margin-bottom: 20px"
          >
            <el-dropdown
              :show-timeout="0"
              placement="bottom"
              trigger="hover"
              @command="cmd => handleItemCommand(cmd, item)"
            >
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="['otp', 'yun_ad'].includes(item.idp_type)"
                  command="test"
                >测试</el-dropdown-item>
              </el-dropdown-menu>
              <ItemIcon
                :src="idpSettings[item.idp_type] && idpSettings[item.idp_type].idp_logo"
                :title="item.idp_name"
                style="height: 110px; width: 110px; vertical-align: top; margin-right: 0px"
                show-remove
                @remove="handleRemove(item)"
                @click="$refs.DialogAddMethod.handleOpen(item)"
              />
            </el-dropdown>
          </div>
          <el-button
            style="width: 110px; height: 110px; vertical-align: top;"
            @click="$refs.DialogAddMethod.handleOpen()"
          >
            <i
              class="el-icon-plus"
              style="font-size: 18px"
            />
          </el-button>
        </el-form-item>
      </el-form>
      <DialogAddMethod
        ref="DialogAddMethod"
        @init="fetchList"
      />
    </CardItemForm>
  </div>
</template>

<script>
import ItemIcon from '@/components/Item/ItemIcon'
import DialogAddMethod from './DialogAddMethod'

export default {
  components: { DialogAddMethod, ItemIcon },

  data() {
    return {
      loading: true,
      list: [],
      idpSettings: {}
    }
  },

  created() {
    this.fetchList()
    this.fetchIdpSettings()
  },

  methods: {
    handleItemCommand(cmd, item) {
      console.log(cmd)
      if (cmd === 'test') {
        this.handleTest(item)
      }
    },
    async handleTest(item) {
      const res = await this.Fetch.post('V4/zero.trust.idp.test.conf', {
        idp_id: item.id
      })
      window.open(res.testIdpUrl)
    },

    async fetchIdpSettings() {
      const data = await this.Fetch.get('V4/zero.trust.idp.conf.fields')
      delete data._status
      this.idpSettings = data
    },

    async fetchList() {
      this.loading = true
      const { list = [] } = await this.Fetch.get('V4/zero.trust.idp.list')
      list.forEach(item => {
        if (!item.idp_conf || Array.isArray(item.idp_conf)) {
          item.idp_conf = {}
        }

        if (!item.idp_conf.clusters || !item.idp_conf.clusters.length) {
          item.idp_conf.clusters = [
            {
              ip: '',
              port: ''
            }
          ]
        }
      })

      this.list = list
      this.loading = false
    },

    async handleRemove(item) {
      this.$confirm('确认删除？', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.post('V4/zero.trust.idp.del', {
            idp_id: item.id,
            idp_uuid: item.idp_uuid
          })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    }
  }
}
</script>
