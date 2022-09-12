<style lang="scss">
.ProductNav {
  width: 100%;

  &__popper {
    padding: 4px 0;
  }

  .NavItem {
    border-bottom: 1px solid $--border-color-lighter;

    &:last-child {
      border-bottom: none;
    }
  }

  &__title {
    display: inline-block;
    cursor: pointer;
    color: $--color-text-regular;
    font-size: 13px;

    .icon {
      margin-right: 6px;
    }

    &--visible {
      color: #2991fa;
      border-color: #bfdefe;
      background-color: #eaf4ff;
    }
  }
}
</style>

<template>
  <el-popover
    v-model="visible"
    :popper-class="b('popper')"
    width="200"
    trigger="click"
    placement="bottom-start"
  >
    <div :class="b()">
      <NavItem
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
        :icon="item.icon"
        :class="b('item')"
        :active="item.id === groupId"
        class="ya-iconfont"
        @click="handleClick(item.id)"
      />
    </div>
    <el-button
      slot="reference"
      :class="b('title', {visible})"
    >
      <i class="el-icon-menu icon" />
      {{ groupItem && groupItem.title }}
      <i
        class="el-icon-caret-bottom arrow"
        style="margin-left: 10px"
      />
    </el-button>
  </el-popover>
</template>

<script>
import create from '@/utils/create-basic'
import NavItem from './NavItem'

export default create({
  name: 'ProductNav',

  components: { NavItem },

  data() {
    return {
      visible: false
    }
  },

  computed: {
    groupId() {
      return this.$store.state.app.sidebarGroupId
    },

    groupItem() {
      const id = this.groupId
      const list = this.list
      const item = list.find(_ => _.id === id)
      return item
    },

    list() {
      return this.$store.state.app.sidebarGroups
    }
  },

  methods: {
    handleClick(id) {
      this.SET_SIDEBAR_GROUP_ID(id)
      this.visible = false
    }
  }
})
</script>
