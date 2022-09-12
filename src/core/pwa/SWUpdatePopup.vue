<style lang="scss">
.SWUpdatePopup {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 16px;
  border: 1px solid $--color-primary;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 2;
  width: 200px;

  .el-button {
    margin-top: 16px;
  }
}
</style>

<template>
  <div
    v-if="enabled"
    class="SWUpdatePopup"
  >
    有新版本可用<br>
    <el-button
      type="primary"
      @click="reload"
    >更新</el-button>
  </div>
</template>

<script>
import event from './event'

export default {
  data() {
    return {
      updateEvent: null
    }
  },

  computed: {
    enabled() {
      return Boolean(this.updateEvent)
    }
  },

  created() {
    event.$on('sw-updated', this.onSWUpdated)
  },

  methods: {
    onSWUpdated(e) {
      console.log(111, e)
      this.updateEvent = e
    },

    reload() {
      if (this.updateEvent) {
        this.updateEvent.skipWaiting().then(() => {
          location.reload(true)
        })
        this.updateEvent = null
      }
    }
  }
}
</script>

