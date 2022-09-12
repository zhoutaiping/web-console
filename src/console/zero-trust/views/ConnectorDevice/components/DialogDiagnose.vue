<style lang="scss">
.DialogDiagnose{

  .StatusList{
    border: 1px solid $--border-gray;
    background-color: $--background-color-base;
    padding: 12px 20px;
    min-height: 100px;
  }

  .StatusItem{
    display: flex;
    height: 32px;
    align-items: center;

    .icon{
      font-size: 20px;
    }

    .text{
      margin-right: 10px;
      font-size: 14px;
    }
  }
}

</style>

<template>
  <DmDialog
    ref="Dialog"
    submit-text="确认"
    width="500px"
    class="DialogDiagnose"
    title="在线诊断"
    @submit="handleSubmit"
  >
    <div
      v-loading="loading"
      class="StatusList"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        style="margin-bottom: 0px"
        class="StatusItem"
      >
        <span class="text">
          {{ item.name }}
        </span>
        <i
          v-if="item.value"
          class="icon el-icon-success color--success"
        />
        <i
          v-else
          class="icon el-icon-error color--danger"
        />
      </div>
    </div>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import FormItemNotice from '@/components/FormItem/FormItemNotice'

export default createDialog({
  components: { FormItemNotice },

  data() {
    return {
      loading: true,
      list: []
    }
  },

  methods: {
    initOptions() {
      this.list = []
      this.fetchInfo()
    },

    async fetchInfo() {
      this.loading = true
      const res = await this.Fetch.post('V4/zero.trust.connector.device.diagnose', {
        device_id: this.form.device_id
      })

      this.loading = false
      delete res._status
      this.list = res
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.handleClose()
    }
  }
})
</script>
