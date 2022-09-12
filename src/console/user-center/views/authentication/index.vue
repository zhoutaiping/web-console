<template>
  <console-page-layout>
    <unauthorized v-if="this.$store.state.authentiStore.status === 0||this.$store.state.authentiStore.status === 3||this.$store.state.authentiStore.status === 5||this.$store.state.authentiStore.status === 8"/>
    <inreview v-else-if="this.$store.state.authentiStore.status === 2||this.$store.state.authentiStore.status === 4||this.$store.state.authentiStore.status === 7"/>
    <audited v-else-if="this.$store.state.authentiStore.status === 1||this.$store.state.authentiStore.status === 6"/>
  </console-page-layout>
</template>
<script>
import Unauthorized from './modules/unauthorized'
import inReview from './modules/inReview'
import Audited from './modules/audited'
export default {
  components: {
    unauthorized: Unauthorized,
    inreview: inReview,
    audited: Audited
  },
  data() {
    return {
      status: '',
      type: ''
    }
  },
  mounted() {
    this.$store.dispatch('getBasicinfo')
  },
  methods: {
    handleClick(tab, event) {
      const val = tab.$el.getAttribute('value')
      val === 'personal' ? this.personal = true : this.personal = false
    }
  }
}
</script>

<style lang="scss" scoped>

.authentication-box {
  margin: 15px;
  background: #fff;
}

.user-title::before {
  content: "";
  display: inline-block;
  width: 3px;
  height: 20px;
  background: $--color-primary;
  vertical-align: text-bottom;
  margin-right: 10px;
}

</style>
