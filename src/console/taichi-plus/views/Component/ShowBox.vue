<template>
  <div class="list-container">
    <ul :class="{'active-web-origin-domain':contentShow}" class="web-origin-domain">
      <li @click="showList">
        <i v-if="webListLength>2" :class="{'position-fix': contentShow}" class="el-icon-caret-bottom el-icon--right position-adjust"/>
      </li>
      <li v-for="(item,index) in webList" v-show="index <= 1 ||contentShow" :key="index" :value="index">
        <span v-show="item.view !== undefined" :class="[item.view==='primary'?'ya-yun-view-main':'ya-yun-view-backup']" class="ya-iconfont circuit-type"/>
        <span class="domain-value">{{ item.value }}</span>
        <span v-show="item.port">/{{ item.port }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    webList: {
      type: null
    },
    iconShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      contentShow: false,
      contentStatus: false,
      content: []
    }
  },
  computed: {
    webListLength() {
      if (this.webList) { return this.webList.length }
    }
  },
  mounted() {
    const $body = document.getElementsByTagName('body')[0]
    $body.addEventListener('click', this.closeView, false)
  },
  methods: {
    showList() {
      this.contentShow = !this.contentStatus
      this.contentStatus = this.contentShow
    },
    closeView(e) {
      if (!this.$el.contains(e.target)) { this.contentShow = false }
    }
  }
}
</script>

<style lang="scss">
.list-container {
  width: 100%;
  margin: 0 auto;
  ul {
    li {
      line-height: 18px;
    }
  }
}

.web-origin-domain.active-web-origin-domain {
  text-align: left;
  padding: 10px 10px 10px 10px;
  border: 1px solid #d6d6d6;
  box-shadow: 0 0 25px $--border-gray;
  background: #fff;
  z-index: 9999;
  position: absolute !important;
  top: 6px;
  left: 0px;
  box-sizing: border-box;
  li {
    .position-adjust {
      position: absolute;
      top: 2px;
      right: 0px;
    }
  }
}

.web-origin-domain {
  margin: 0 auto;
  width: inherit;
  text-align: left;
  padding: 10px 0;
  li {
    position: relative;
    .circuit-type {
      width: 12px;
      height: 12px;
    }
    .position-adjust {
      position: absolute;
      width: 12px;
      height: 12px;
      right: 2px;
      top: 12px;
      z-index: 999;
      cursor: pointer;
    }
    .position-fix {
      top: 20px;
    }
    .domain-value {
      text-align: center;
    }
  }
}
</style>
