<template>
  <yd-card
    horizontal
    title="页面压缩"
  >
    <template slot="tips">Gzip压缩网页资源，节约传输内容，提高访问速度，有效改善动态页面的优化支持</template>
    <el-form>
      <el-form-item>
        <el-checkbox
          v-model="form.compress_js"
          true-label="on"
          false-label="off"
          @change="fetchUpdate()"
        >JS</el-checkbox>
        <el-checkbox
          v-model="form.compress_css"
          true-label="on"
          false-label="off"
          @change="fetchUpdate()"
        >CSS</el-checkbox>
        <el-checkbox
          v-model="form.compress_html"
          true-label="on"
          false-label="off"
          @change="fetchUpdate()"
        >HTML</el-checkbox>
      </el-form-item>
    </el-form>
  </yd-card>
</template>

<script>
import panelMixins from '../panelMixins'

export default {
  name: 'PageGzip',

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'page_gzip',
      formDefault: {
        compress_css: 'off',
        compress_html: 'off',
        compress_js: 'off'
      }
    }
  }
}
</script>
