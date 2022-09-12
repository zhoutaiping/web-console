<template>
  <console-page-layout :tabs="navbar">
    <template slot="tab-item">
      <navbar-page-item
        v-if="moduleSettings['red-guard'].ssa"
        @click="handleClickWAF"
      >{{ $t('button.dataScreen') }}</navbar-page-item>
    </template>
    <router-view />
  </console-page-layout>
</template>

<script>
import NavbarPageItem from '@/components/Navbar/NavbarPageItem'

export default {
  inject: ['ModuleId'],

  components: {
    NavbarPageItem
  },

  data() {
    return {
      navbar: []
    }
  },

  created() {
    const id = this.ModuleId
    this.navbar = [
      {
        name: `${id}.router.menaceAnalyze__WAFAttack`
      },
      {
        name: `${id}.router.menaceAnalyze__AccurateAccessControl`
      },
      {
        name: `${id}.router.menaceAnalyze__CCAttack`
      },
      {
        name: `${id}.router.menaceAnalyze__Bot`
      }
    ]
  },

  methods: {
    async handleClickWAF() {
      const data = await this.Fetch.get('V4/member.whole.report.token', { report_type: 'waf' })
      const ssaUrl = this.moduleSettings['red-guard'].ssaUrl
      window.open(`${ssaUrl}/waf?id=${data.member_id}&token=${data.token}`)
    }
  }
}
</script>
