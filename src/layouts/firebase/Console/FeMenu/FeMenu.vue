<template>
  <div :class="b()">
    <slot />
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import emitter from '@/mixins/emitter'

export default create({
  componentName: 'FeMenu',

  name: 'FeMenu',

  mixins: [emitter],

  provide() {
    return {
      rootMenu: this
    }
  },

  props: {
    collapse: Boolean,
    defaultActive: {
      type: String,
      default: ''
    },
    uniqueOpened: {
      type: Boolean,
      default: false
    },
    defaultOpeneds: Array
  },

  data() {
    return {
      activeIndex: this.defaultActive,
      openedMenus: (this.defaultOpeneds && !this.collapse) ? this.defaultOpeneds.slice(0) : []
    }
  },

  watch: {
    defaultActive(value) {
      if (!this.items[value]) {
        this.activeIndex = null
      }
      this.updateActiveIndex(value)
    },

    defaultOpeneds(value) {
      if (!this.collapse) {
        this.openedMenus = value
      }
    }
  },

  mounted() {
    this.$on('menu-group-click', this.openMenuGroup)
  },

  methods: {
    openMenuGroup(e) {
      const { open, index } = e
      const openedMenus = this.openedMenus
      if (open) {
        const i = this.openedMenus.indexOf(index)
        if (i !== -1) {
          this.openedMenus.splice(i, 1)
        }
      } else {
        if (!openedMenus.includes(index)) {
          if (this.uniqueOpened) {
            this.openedMenus = [index]
          } else {
            this.openedMenus.push(index)
          }
        }
      }
    }
  }
})
</script>
