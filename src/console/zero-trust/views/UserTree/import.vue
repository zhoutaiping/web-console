<template>
  <div class="PageUserTree">
    <DmAlert>使用Excel方式导入组织架构或用户，请先下载模板文档，按照模板文档规则填写组织架构或用户信息，确保对应字段信息无误后再上传。</DmAlert>
    <el-container class="PageUserTree-wrap">
      <el-aside
        v-loading="loadingTree"
        class="PageUserTree-aside"
        width="300px"
      >
        <DmToolbar>
          <InputSearch
            v-model="treeParams.search"
            placeholder="支持模糊查询"
            style="width: 100%"
            @submit="fetchTree"
          />
        </DmToolbar>
        <el-tree
          ref="Tree"
          :data="treeData"
          :expand-on-click-node="false"
          style="background: rgba(0,0,0,0)"
          default-expand-all
          node-key="id"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <div class="custom-tree-node-wrapper">
              <span class="custom-tree-node-label">
                {{ node.label }}
              </span>
              <span class="operate-btns" />
            </div>
          </span>
        </el-tree>
      </el-aside>
      <el-main
        :span="16"
        class="PageUserTree-main"
        style="padding: 0; height: 100%"
      >
        <DmCard style="height: 800px">
          <DmToolbar>
            <a
              href="https://yundun-statics.yundun.com/exportGroupsUser.xlsx"
              target="_blank"
            >
              <el-button type="primary">下载导入模板文档</el-button>
            </a>
            <TipsTooltip
              style="margin-top: 8px"
              title="邮箱和所属部门请至少填写一个，每次上传会匹配邮箱或者所属部门，不同数据会更新，请谨慎上传"
            />
          </DmToolbar>
          <div style="padding: 32px 0">
            <el-form>
              <el-form-item label="上传 .xls 文件">
                <el-input
                  v-model="fileName"
                  :readonly="true"
                  placeholder=""
                  style="width:200px;"
                />
                <el-upload
                  ref="Upload"
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
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button
                  :loading="uploadLoading"
                  type="primary"
                  @click="handleSubmit"
                >导入到组织架构树</el-button>
              </el-form-item>
            </el-form>
          </div>
        </DmCard>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import TipsTooltip from '@/components/Tips/TipsTooltip'

function formatTree(list) {
  return list.map(item => {
    item.label = item.name
    if (item.subGroups && item.subGroups.length) {
      item.children = formatTree(item.subGroups)
    }
    return item
  })
}

export default {
  components: { TipsTooltip },

  mixins: [consoleData],

  data() {
    return {
      menuVisible: false,
      treeData: [],
      treeParams: {
        search: ''
      },
      loadingTree: false,

      uploadLoading: false,
      fileName: '',
      fileList: [],
      uploadFiles: []
    }
  },

  created() {
    this.init()
    this.initUpload()
  },

  methods: {
    initUpload() {
      this.uploadFiles = null
      this.fileName = ''
      this.$refs.Upload.clearFiles()
    },

    init() {
      this.fetchTree()
    },

    async handleSubmit() {
      if (!this.uploadFiles) return

      const form = new FormData()
      form.append('xls_file', this.uploadFiles)

      this.uploadLoading = true
      try {
        await this.Fetch.upload('V4/zero.trust.yunad.user.import', form)
      } catch (e) {
        return
      } finally {
        this.initUpload()
        this.uploadLoading = false
      }
      this.$message.success('导入成功！载入可能需要时间，请稍候片刻')
    },

    fileChange(file) {
      this.$refs.Upload.clearFiles()
      this.uploadFiles = file.raw
      this.fileName = file.name
    },

    async fetchTree() {
      this.loadingTree = true
      const data = await this.Fetch.post('V4/zero.trust.yunad.organization.all', this.treeParams)
      delete data._status
      if (!data || !data.length) {
        this.treeData = [
          {
            label: '我的组织',
            id: 'root'
          }
        ]
      } else {
        this.treeData = formatTree(data)
      }
      this.loadingTree = false
    }
  }
}
</script>

<style lang="scss">
.PageUserTree-wrap {
  background-color: #fafafa;
}

.PageUserTree {
  &-aside {
    padding: 16px;
  }

  .el-tree-node.is-expanded.is-current.is-focusable {
    .el-tree-node__content {
      background: $--background-color-base !important;

      &:active,
      &:hover {
        background: $--background-color-base !important;
      }
    }
  }
}

.el-tree-node__content {
  position: relative;
  .operate-btns {
    position: absolute;
    right: 2px;
    display: none;
  }
  // 鼠标悬停时，展示
  &:hover,
  :focus-within {
    .operate-btns {
      display: inline;
    }
  }
}
</style>
