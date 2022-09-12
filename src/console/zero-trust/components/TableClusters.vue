<template>
  <div>
    <el-form
      v-for="(item, index) in value"
      :ref="`Form__${index}`"
      :key="index"
      :model="item"
      label-position="right"
      inline
      style="margin-bottom: 10px"
    >
      <el-form-item
        label="IP"
        prop="ip"
      >
        <el-input
          v-model="item.ip"
          style="width: 100%"
          placeholder="0.0.0.0"
        />
      </el-form-item>
      <el-form-item
        label="PORT"
        prop="port"
      >
        <el-input
          v-model="item.port"
          style="width: 80px"
          placeholder="8080"
        />
      </el-form-item>
      <template v-if="index === 0">
        <!--  -->
      </template>
      <a
        v-else
        :class="
        b('btnSort')"
        class="el-icon-remove"
        @click="handleRowRemove(index)"
      />
    </el-form>
    <div style="margin-top: 0px; margin-left: 22px">
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
      const val = this.value
      console.log(val)
    },

    handleAdd() {
      console.log(this.value)
      this.value.push({
        ip: '',
        port: ''
      })
    },

    handleRowRemove(index) {
      this.value.splice(index, 1)
    }
  }
})
</script>
