<template>
  <div class="content-box">
    <msgBox />
    <companyinfo v-if="this.$store.state.authentiStore.type === 2||this.$store.state.authentiStore.status === 4"/>
    <governInfo v-else-if="this.$store.state.authentiStore.type === 3||this.$store.state.authentiStore.status === 7" />
    <personalinfo v-else/>
  </div>
</template>

<script>
import msgBox from '../components/msgBox'
import personalInfo from '../components/personalInfo'
import companyInfo from '../components/companyInfo'
import governInfo from '../components/governInfo'
export default {
  components: {
    msgBox,
    personalinfo: personalInfo,
    companyinfo: companyInfo,
    governInfo
  },
  data() {
    return {
      personalInfo: {
        name: '吴世勋',
        IDcard: '35412544',
        phone: '13717546532',
        pic: '已上传'
      },
      companyInfo: {
        name: '上海**公司',
        code: '1234564567',
        busLicense: '已上传'
      }
    }
  },
  computed: {
    name() {
      return this.$store.state.authentiStore.info.personal.name
    },
    IDnumber() {
      return this.$store.state.authentiStore.info.personal.personal_id_card
    },
    mobile() {
      return this.$store.state.authentiStore.info.personal.mobile
    },
    pic() {
      return this.$store.state.authentiStore.info.personal.personal_id_card_pic
    },
    companyName() {
      return this.$store.state.authentiStore.info.company.name
    },
    companyCode() {
      return this.$store.state.authentiStore.info.company.code
    },
    companyLicense() {
      return this.$store.state.authentiStore.info.company.license
    },
    contact() {
      return this.$store.state.authentiStore.info.company.contact
    },
    contactMobile() {
      return this.$store.state.authentiStore.info.company.mobile
    }
  },
  mounted() {}
}
</script>
<style media="screen" scoped>
.content-box {
  padding: 10px;
}
</style>
