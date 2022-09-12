<template>
  <div>
    <DmToolbar>
      <router-link :to="{ name: 'cloud-wall.router.dataReport__ddosAttack'}">
        <el-button>返回</el-button>
      </router-link>
    </DmToolbar>
    <CardDDoSAttackDetail ref="CardDDoSAttackDetail" />
    <TableDDosAttackDetail
      ref="TableDDosAttackDetail"
      class="margin-top"
    />
  </div>
</template>

<script>
import CardDDoSAttackDetail from './components/CardDDoSAttackDetail'
import TableDDosAttackDetail from './components/TableDDosAttackDetail'

export default {
  components: { CardDDoSAttackDetail, TableDDosAttackDetail },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      const params = {
        ddos_id: this.$route.query.id,
        ...this.$route.query
      }
      this.$refs.CardDDoSAttackDetail.fetchData(params)
      this.$refs.TableDDosAttackDetail.fetchInit(params)
    }
  }
}
</script>
