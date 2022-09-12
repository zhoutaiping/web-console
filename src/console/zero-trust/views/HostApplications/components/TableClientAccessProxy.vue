<template>
  <div class="margin-bottom">
    <DmCard
      v-for="(item, index) in list"
      :key="index"
      class="margin-top"
    >
      <template slot="title">
        域名应用地址{{ index > 0 ? index + 1 : '' }}
      </template>
      <a
        slot="action"
        style="margin-top: -20px"
        @click="handleRowDelete(index)"
      >删除</a>
      <el-form
        :model="item"
        :rules="formRules"
        :ref="`domain-${index}`"
        label-position="right"
        label-width="100px"
      >
        <el-form-item
          label="访问地址"
          prop="domain"
        >
          <el-input
            v-model="item.domain"
            style="width: 350px; margin-right: 10px"
            placeholder="域名（精确域名，不支持*域名）"
          />
          <el-input
            v-model="item.port"
            style="width: 120px"
            placeholder="端口"
          />
        </el-form-item>
        <el-form-item label="回源地址">
          <TableProxyForwardingProfile v-model="item.back_to_origins" />
        </el-form-item>
      </el-form>
    </DmCard>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import TableProxyForwardingProfile from '../../../components/TableProxyForwardingProfile'
import consoleTable from '@/mixins/consoleTable'

export default create({
  components: { TableProxyForwardingProfile },

  mixins: [consoleTable],

  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {
      rowKey: ['domain'],
      row: {
        domain: '',
        port: '',
        back_to_origins: [
          {
            protocol: 'tcp',
            domain_ip: '',
            port: ''
          }
        ],
        type: 0
      },
      formRules: {
        domain: {
          required: true,
          message: '请填写域名',
          trigger: 'blur'
        }
      }
    }
  },

  watch: {
    list() {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
    }
  }
})
</script>
