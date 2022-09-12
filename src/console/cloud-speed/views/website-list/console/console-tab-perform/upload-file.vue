<template>
  <yd-card
    horizontal
    title="最大文件上传大小"
  >
    <template slot="tips">CDN 节点支持上传文件的最大数据长度</template>
    <el-form>
      <el-form-item label="请求上传文件的最大数据长度">
        <el-input
          v-model="uploadView"
          disabled
          style="width: 200px"
        />
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import panelMixins from '../panelMixins'

export default {
  name: 'UploadFile',

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'upload_file'
    }
  },

  computed: {
    uploadView() {
      return `${this.form.upload_size || ''} ${this.form.upload_size_unit || ''}`
    }
  }
}
</script>
