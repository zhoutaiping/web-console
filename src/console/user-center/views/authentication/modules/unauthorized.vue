<template>
  <div>
    <div>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-if="tab.personal"
          label="个人认证"
          name="first"
          value="personal"
        />
        <el-tab-pane
          v-if="tab.company"
          label="企业认证"
          name="second"
          value="company"
        />
        <el-tab-pane
          v-if="tab.govern"
          label="政府或事业单位认证"
          name="third"
          value="govern"
        />
      </el-tabs>
    </div>
    <div>
      <msgBox />
      <yd-alert
        v-show="isFailed"
        type="warning"
      >
        <Tip
          ref="tip"
          :content="content"
        />
      </yd-alert>
      <div>
        <personalbox v-if="show.personal" />
        <companybox v-else-if="show.company" />
        <governBox v-else-if="show.govern" />
      </div>
    </div>
  </div>
</template>

<script>
import msgBox from '../components/msgBox'
import personalBox from '../components/personalBox'
import companyBox from '../components/companyBox'
import governBox from '../components/governBox'
import Tip from '@/components/Tip/Tip'
// import TipDirective from '@/components/Tip/Tip.directive'
export default {
  components: {
    Tip,
    msgBox,
    personalbox: personalBox,
    companybox: companyBox,
    governBox
  },
  data() {
    return {
      content: [],
      singleShow: false,
      activeName: 'first',
      tab: {
        personal: true,
        company: true,
        govern: true
      },
      show: {
        personal: true,
        company: false,
        govern: false
      },
      personal: true,
      company: false,
      govern: false,
      personalTabShow: true,
      companyTabShow: true,
      governTabShow: true,
      isFailed: false
    }
  },
  computed: {
    userStatus() {
      return this.$store.state.authentiStore.status
    },
    userType() {
      return this.$store.state.authentiStore.type
    }
  },
  mounted() {
    // 认证状态区分显示内容
    if ((this.userStatus === 3 &&
      this.userType === 2) ||
      this.userStatus === 5) {
      this.dataShow(this.tab, 'company')
      this.dataShow(this.show, 'company')
      this.activeName = 'second'
      this.userStatus === 3 ? this.content = ['企业审核不通过']
        : this.content = ['个人升级为企业审核不通过']
      this.isFailed = true
    } else if (this.userStatus === 3 &&
      this.userType === 1) {
      this.dataShow(this.tab, 'personal')
      this.dataShow(this.show, 'personal')
      this.activeName = 'first'
      this.content = ['个人审核不通过']
      this.isFailed = true
    } else if (this.userStatus === 8 || this.userStatus === 3 &&
      this.userType === 3) {
      this.dataShow(this.tab, 'govern')
      this.dataShow(this.show, 'govern')
      this.userStatus === 7 ? this.content = ['政府审核不通过']
        : this.content = ['个人升级为政府审核不通过']
      this.activeName = 'third'
      this.isFailed = true
    }
    this.content.push(this.$store.state.authentiStore.reason)
  },
  methods: {
    handleClick(tab, event) {
      const val = tab.$el.getAttribute('value')
      this.dataShow(this.show, val)
    },
    dataShow(data, val) {
      for (const i in data) { data[i] = i === val }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-parent {
  margin-left: 18px;
}

.content-box {
  /*margin-top: 8px;*/
  padding: 10px;
  /*background: #fff;*/
}

.tab {
  margin: 0;
  padding: 0;
  border: 0;
  background-color: #f0f0f0;
  height: 7px;
  box-shadow: 0 0 10px #efefef;
}
</style>
