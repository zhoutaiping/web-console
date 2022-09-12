<template>
  <div>
    <DmCard
      v-for="(item, index) in value"
      :key="index"
      class="margin-top"
    >
      <template slot="title">
        IP应用地址{{ index > 0 ? index + 1 : '' }}
      </template>
      <a
        slot="action"
        style="margin-top: -20px"
          @click="handleRowRemove(index)"
      >删除</a>
      <el-form
        :ref="`Form__${index}`"
        :key="index"
        :model="item"
        :rules="formRules"
        label-position="right"
        inline
      >
        <el-form-item
          label="访问地址"
          prop="domain"
        >
          <el-input
            v-model="item.domain"
            style="width: 350px; margin-right: 10px"
            placeholder="IP地址"
          />
          <el-input
            v-model="item.port"
            style="width: 120px"
            placeholder="端口"
          />
        </el-form-item>

        <template v-if="index === 0">
          <!--  -->
        </template>
        <!-- <a
          v-else
          :class="b('btnSort')"
          class="el-icon-remove"
          @click="handleRowRemove(index)"
        /> -->
      </el-form>
    </DmCard>
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
        }
      ],
      formRules: {
        domain: {
          required: true,
          message: '请填写IP',
          trigger: 'blur'
        }
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
      // const val = this.value
    },

    handleAdd() {
      this.value.push({
        domain: '',
        port: '',
        type: 1
      })
    },

    handleRowRemove(index) {
      this.value.splice(index, 1)
    }
  }
})
</script>
