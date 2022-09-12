<style lang="scss">
.DialogTemplate{
  .TemplateList{
    display: flex;
    padding: 12px 0;
  }

  .TemplateItem{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #666;
    font-size: 13px;
    transition: .4s;
    width: 140px;

    &:hover{
      opacity: .7;
    }
  }
}

</style>

<template>
  <DmDialog
    ref="Dialog"
    :footer="false"
    width="700px"
    class="DialogTemplate"
    title="SaaS 应用模板"
  >
    <el-tabs v-model="activeType">
      <el-tab-pane
        v-for="(item, index) in selectType"
        :key="index"
        :label="item.label"
        :name="item.value"
      />
    </el-tabs>
    <yd-scroll style="height: 400px">
      <div class="TemplateList">
        <el-row>
          <el-col
            v-for="(item, index) in list.filter(_ => _.template_type_id === Number(activeType))"
            :span="6"
            :key="index">
            <a class="TemplateItem" @click="handleClick(item)">
              <el-image
                :src="item.logo"
                fit="contain"
                style="width: 75px; height: 75px; margin-bottom: 8px"
              />
              <p>{{ item.app_type }}</p>
            </a>
          </el-col>
        </el-row>
      </div>
    </yd-scroll>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

export default createDialog({
  data() {
    return {
      formDefault: {
        name: '',
        title: ''
      },
      formRules: {
        content: { required: true, message: '请输入' }
      },
      list: [],
      activeType: '',
      selectType: []
    }
  },

  methods: {
    initOptions(form, options) {
      this.fetchType()
      this.fetchConf()
    },

    async fetchType() {
      const data = await this.Fetch.get('V4/zero.trust.saas.template')
      delete data._status
      const list = []
      Object.keys(data).forEach(value => {
        list.push({
          label: data[value],
          value
        })
      })
      this.activeType = list[0].value
      this.selectType = list
    },

    async fetchConf() {
      const data = await this.Fetch.get('V4/zero.trust.saas.conf.all')
      delete data._status
      this.list = data
      // this.selectType = data.list.map(_ => {
      //   return {
      //     label: _.template_type_name,
      //     value: _.
      //   }
      // })
    },

    handleClick(item) {
      this.handleClose()
      this.$emit('open', item)
    }
  }
})
</script>
