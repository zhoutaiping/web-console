<template>
  <DmCard
    title="用户"
    style="height: 180px"
  >
    <ItemNumberLite
      title="今日登录成功用户数："
      border
    >
      {{ appTotal.distinct_user_identity }}
    </ItemNumberLite>
    <ItemNumberLite
      title="本月登录成功用户数："
      style="margin-top: 10px"
      border
    >
      {{ appTotal.month_active_user }}
    </ItemNumberLite>
  </DmCard>
</template>

<script>
import ItemNumberLite from '@/components/Item/ItemNumberLite'

export default {
  components: { ItemNumberLite },

  props: {
    appTotal: Object
  },

  data() {
    return {
    }
  },

  computed: {},

  methods: {}
}
</script>
