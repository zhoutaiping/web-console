<style lang="scss">
.HeaderAlert {
  display: flex;
  margin-top: -16px;
  margin-left: -16px;
  margin-right: -16px;
  background: #fff;
}
</style>

<template>
  <div :class="b()">
    <el-alert type="warning">
      WEB安全加速支持SSL证书免费申购和自动续期啦！ <el-button
        type="text"
        @click="$refs.Dialog.handleOpen()"
      >查看详情</el-button>
    </el-alert>
    <DmDialog
      ref="Dialog"
      :footer="false"
      title="YUNDUN产品升级公告"
      width="700px"
      @close="onDialogClose"
    >
      <!-- <div style="line-height: 1.7;">
        尊敬的YUNDUN用户:<br>
      </div> -->
      <p style="line-height: 1.7;  text-indent:28px">
        WEB安全加速新增Let's Encrypt域名型SSL证书（DV SSL）申购和自动续期功能，为您提供SSL证书申购、一键部署、证书托管、证书续期等一站式服务，以最低的成本为您的应用提供HTTPS自动化解决方案。</p>
        <!-- <p style="margin-top: 30px; line-height: 1.7;  text-indent:28px">感谢您对上海云盾的信赖与支持，我们将竭力为您服务。</p> -->
    </DmDialog>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'HeaderAlert',

  mounted() {
    // if (!this.$ls.get('serviceAlert')) this.$refs.Dialog.handleOpen()
  },

  methods: {
    onDialogClose() {
      // this.$ls.set('serviceAlert', 1)
    }
  }
})
</script>
