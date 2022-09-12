<template>
  <div>
    <el-form
      v-for="(item, index) in value"
      :ref="`Form__${index}`"
      :key="index"
      :model="item"
      label-position="right"
      inline
    >
      <el-form-item prop="protocol">
        <yd-form-select
          :selects="selectProtocol"
          v-model="item.protocol"
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item prop="domain">
        <el-input
          v-model="item.domain"
          style="width: 220px"
          placeholder="域名或IP地址（支持CIDR格式）"
        />
      </el-form-item>
      <el-form-item prop="port">
        <el-input
          v-model="item.port"
          style="width: 120px"
          placeholder="端口或端口范围"
        />
      </el-form-item>
      <template v-if="index === 0">
        <!--  -->
      </template>
      <a
        v-else
        :class="b('btnSort')"
        class="el-icon-remove"
        @click="handleRowRemove(index)"
      />
    </el-form>
    <div style="margin-top: 0px;">
      <el-button @click="handleAdd">+ 添加</el-button>
    </div>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {
      selectProtocol: [
        {
          label: 'TCP',
          value: 'tcp'
        },
        {
          label: 'UDP',
          value: 'udp'
        },
        {
          label: '所有',
          value: 'all'
        }
      ]
    }
  },

  watch: {
    value() {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      // const val = this.value
    },

    handleAdd() {
      this.value.push({
        protocol: 'tcp',
        domain: '',
        port: ''
      })
    },

    handleRowRemove(index) {
      this.value.splice(index, 1)
    }
  }
})
</script>
