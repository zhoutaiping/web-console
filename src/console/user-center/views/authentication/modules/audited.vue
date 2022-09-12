<template>
  <div>
    <msgBox/>
    <DmAlert v-show="containerShow">
      <template v-if="tipTarget === 'company'">
        <p>1. 支持个人认证用户升级为企业认证用户； 不支持企业认证用户降级为个人认证用户</p>
        <p>2. 支持企业认证用户申请企业增值税普通发票或增值税专用发票， 享企业专用节点资源等定制化服务</p>
        <p>3. 您对您所填信息的真实性负全部法律责任， {{ appAssets.company }}有权禁用任何有信息伪造行为的用户账号</p>
      </template>
      <template v-if="tipTarget === 'govern'">
        <p>1. 支持个人认证用户升级为政府或事业单位认证用户；不支持政府或事业单位认证用户降级为个人认证用户</p>
        <p>2. 支持政府或事业单位认证用户申请增值税普通发票或增值税专用发票，享政府或事业单位专用节点资源等定制化服务</p>
        <p>3. 您对您所填信息的真实性负全部法律责任，{{ appAssets.company }}有权禁用任何有信息伪造行为的用户账号</p>
      </template>
    </DmAlert>
    <div class="audited-box">
      <companyinfo v-if="this.$store.state.authentiStore.type === 2"/>
      <governInfo v-else-if="this.$store.state.authentiStore.type === 3" />
      <personalinfo v-else v-show="!containerShow"/>
      <div v-if="this.$store.state.authentiStore.type === 1 && !containerShow" class="btn-group">
        <el-button v-if="this.$store.state.authentiStore.type === 1&&this.$store.state.authentiStore.area===1" type="primary" @click="showUp('company')">升级认证为企业</el-button>
        <el-button v-if="this.$store.state.authentiStore.type === 1&&this.$store.state.authentiStore.area===1" type="primary" @click="showUp('govern')">升级认证为政府或事业单位</el-button>
      </div>
      <div v-show="containerShow" class="card-content">
        <companyBox v-show="tipTarget === 'company'"/>
        <governBox v-show="tipTarget === 'govern'" />
        <el-button v-show="containerShow" class="cancel-btn" @click="containerShow=false">取消升级</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import Tip from '@/components/Tip/Tip'
import msgBox from '../components/msgBox'
import personalInfo from '../components/personalInfo'
import companyInfo from '../components/companyInfo'
import governInfo from '../components/governInfo'
import governBox from '../components/governBox'
import companyBox from '../components/companyBox'
export default {
  components: {
    msgBox,
    personalinfo: personalInfo,
    companyinfo: companyInfo,
    governInfo,
    governBox,
    companyBox
    // Tip
  },
  data() {
    return {
      containerShow: false,
      updateTip: [],
      tipTarget: '',
      mainShow: true
    }
  },
  methods: {
    showUp(target) {
      this.containerShow = true
      this.tipTarget = target
    }
  }
}
</script>

<style lang="scss" scoped>
.content-box {
  padding: 7px 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.audited-box {
  position: relative;
}

.cancel-btn {
  position: absolute;
  bottom: 21px;
  left: 30px;
  padding: 10px 23px;
}

.btn-group {
  background: #f7f7f7;
  padding: 12px;
  padding-top: 0px;
  padding-left: 134px;
}
</style>
