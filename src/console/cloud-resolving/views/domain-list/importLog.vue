<template>
  <console-page-layout>
    <DmAlert>
      1. 上传文件格式支持xls，大小不超过2MB<br>
      2. 根据模板，编辑文件格式，上传解析记录<br>
      3. 单次最多支持上传5个域名，单个域名单表支持上传200条记录，若超过200条由于网络原因可能上传失败，请分批导入<br>
      4. 每个表格页只允许添加单个域名的主机记录<br>
    </DmAlert>
    <DmCard>
      <el-form label-width="150">
        <el-form-item>
          <el-button
            type="primary"
            @click="Help.download('/data/file/ResolvingResource.xls')"
          >下载模板</el-button>
          <el-button
            type="text"
            @click="$refs.DialogImport.handleOpen()"
          > 上传帮助</el-button>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-input
            v-model="fileName"
            :readonly="true"
            placeholder=""
            style="width:200px;"
          />
          <el-upload
            ref="upload"
            :on-change="fileChange"
            :file-list="fileList"
            :limit="1"
            :show-file-list="false"
            :auto-upload="false"
            action="api"
            style="display: inline-block"
          >
            <el-button
              slot="trigger"
              style="margin-left: 8px"
            >选取文件</el-button>
            <el-button
              :loading="uploadLoading"
              style="margin-left: 8px"
              type="primary"
              @click="handleSubmit"
            >上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </DmCard>
    <DialogImport ref="DialogImport" />
  </console-page-layout>
</template>

<script>
import DialogImport from './DialogImport'

export default {
  components: {
    DialogImport
  },

  data() {
    return {
      uploadForm: {},
      uploadLoading: false,
      fileName: '',
      fileList: [],
      uploadFiles: []
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      this.uploadFiles = null
      this.fileName = ''
    },

    async handleSubmit() {
      if (!this.uploadFiles) return

      const form = new FormData()
      form.append('xls_file', this.uploadFiles)

      this.uploadLoading = true
      try {
        await this.Fetch.upload(`V4/CloudDns.DomainRecords.batchImport`, form)
      } catch (e) {
        return
      } finally {
        this.uploadLoading = false
      }
      this.Message('TASK_SUBMIT')
      this.init()
    },

    fileChange(file, fileList) {
      this.uploadFiles = file.raw
      this.fileName = file.name
    }
  }
}
</script>
