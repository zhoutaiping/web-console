<style lang="scss">
.SettingList{
  display: flex;
  border-bottom: 1px solid $--border-gray;
  padding-bottom: 16px;
  margin-bottom: 16px;

  &__title{
    font-size: 14px;
    margin-bottom: 6px;
    font-weight: 500;
    color: $--color-text-primary;
  }

  &__description{
    font-size: 14px;
    color: $--color-text-secondary;
  }

  &__meta{
    flex: 1;
  }

  &__actions{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

<template>
  <div :class="b()">
    <div :class="b('meta')">
      <h4 :class="b('title')">
        <slot name="title"/>
      </h4>
      <div :class="b('description')">
        <slot name="description"/>
      </div>
    </div>
    <div :class="b('actions')">
      <slot name="actions"/>
    </div>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'SettingList',

  components: {},

  props: {},

  data() {
    return {}
  },

  computed: {},

  methods: {}
})
</script>
