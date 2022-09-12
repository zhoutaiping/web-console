<template>
  <DmDialog
    ref="Dialog"
    :action-visible="false"
    title="上传帮助"
    aside
  >
    <DmAlert>
      <span>1. 主机名：不允许为空（注意：无前缀为‘@’泛域名解析为‘*’）</span><br>
      <span>2. 记录类型：不允许为空（详细记录类型填写规范可与下表中查询）<br>（注意：显性URL为‘XURL’隐形URL为‘YURL’）<br> </span>
      <span>3. 线路：允许为空，为空时默认为‘any’（填写规范：默认运营商时，填写为‘any’)<br>（详细线路填写规范可与下表中查询）</span><br>
      <span>4. MX（优先级）：仅记录类型为MX时，允许填写，为空时默认为‘5’<br>（注意：其余记录类型时，若填写，则导入失败）</span><br>
      <span>5. TTL：允许为空，默认为‘600’</span><br>
      <span>6. 备注：允许为空</span><br>
      <span>7. tab页：名称必须为域名（注意：不能有空的tab页）</span><br>
    </DmAlert>
    <div style="margin-top:10px;">
      <span>记录类型列表</span><br>
      <DmTable
        type="white"
        border
      >
        <el-table
          :data="typeList"
          height="200"
        >
          <el-table-column
            label="类型名称"
            prop="lable"
          />
          <el-table-column
            label="值"
            prop="value"
          />
        </el-table>
      </DmTable>
    </div>
    <div class="margin-top">
      <span>线路查询</span><br>
      <DmToolbar>
        <el-input
          v-model="view_name"
          placeholder="线路名称：例如：华东电信"
          style="width:300px;"
          @keyup.enter.native="search"
        />
        <el-button
          type="primary"
          @click="search"
        >查询</el-button>
        <el-button @click="reset">刷新</el-button>
      </DmToolbar>
      <DmTable
        :loading="viewLoading"
        type="white"
        border
      >
        <el-table
          :data="viewList"
          height="200"
        >
          <el-table-column
            label="线路名称"
            prop="desc"
          />
          <el-table-column
            label="值"
            prop="name"
          />
        </el-table>
      </DmTable>
    </div>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      typeList: [
        { lable: 'A', value: 'A' }, { lable: 'AAAA', value: 'AAAA' }, { lable: 'CNAME', value: 'CNAME' },
        { lable: 'MX', value: 'MX' },
        { lable: 'TXT', value: 'TXT' }, { lable: 'NS', value: 'NS' }, { lable: 'SRV', value: 'SRV' }
      ],
      view_name: '',
      viewList: [],
      viewLoading: false,
      viewSearchList: []
    }
  },

  mounted() {
    this.viewLoading = true
    this.getSelectItems()
  },

  methods: {
    async getSelectItems() {
      const data = await this.Fetch.get('V4/CloudDns.Member.Line.getMemberLines')
      this.viewSearchList = data
      this.viewList = data
      this.viewLoading = false
    },

    fuzzyQuery(list, keyWord) {
      const arr = []
      const reg = new RegExp(keyWord)
      for (let i = 0; i < list.length; i++) {
        // 如果字符串中不包含目标字符会返回-1
        if (list[i].desc.match(reg)) {
          arr.push(list[i])
        }
      }
      return arr
    },

    search() {
      const view_name = this.view_name.replace(/(^\s*)|(\s*$)/g, '')
      if (!view_name) return

      const newData = this.fuzzyQuery(this.viewSearchList, view_name)
      this.viewList = newData
    },

    reset() {
      this.view_name = ''
      this.viewList = this.viewSearchList
    }
  }
})
</script>
