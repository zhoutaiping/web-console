<template>
  <div>
    <DmToolbar>
      <router-link :to="{ name: 'anti-ddos.router.monitorAttackLog'}">
        <el-button>返回</el-button>
      </router-link>
    </DmToolbar>
    <CardAttackDetail />
    <CardAttackChart class="margin-top" />
  </div>
</template>

<script>
import CardAttackDetail from './components/CardAttackDetail'
import CardAttackChart from './components/CardAttackChart'

export default {
  components: { CardAttackDetail, CardAttackChart }
}
</script>
