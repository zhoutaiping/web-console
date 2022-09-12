<template>
  <DmDialog
    ref="Dialog"
    width="700px"
    title="选择模块"
    @submit="handleSubmit"
  >
    <el-form>
      <el-form-item>
        <SelectTransfer
          v-model="form.selectModules"
          :data="settingTabs"
          class="margin-top"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import SelectTransfer from '@/components/Select/SelectTransfer'
import accessMixins from '../../../mixins/access'

export default createDialog({
  components: { SelectTransfer },

  mixins: [accessMixins],

  props: {
    modules: {
      type: Array,
      default: function() {
        return []
      }
    }
  },

  methods: {
    async handleSubmit() {
      this.$emit('submit', this.form)
      this.handleClose()
    }
  }
})
</script>
