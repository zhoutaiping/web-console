<style lang="scss">
.NavbarBasic {
  display: flex;
  align-items: center;
  z-index: 1000;
  height: 70px;
  padding-left: 20px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(9, 18, 26, 0.06),
    0 4px 8px 0 rgba(39, 56, 73, 0.08);

  &__logo {
    height: 40px;
    img {
      height: 100%;
    }
  }
}
</style>

<template>
  <div :class="b()">
    <a
      :class="b('logo')"
      href="/"
    >
      <img
        :src="assets.logoBasic"
        alt="logo"
      >
    </a>
    <div class="pull-right" />
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'NavbarBasic',

  computed: {
    assets() {
      return this.$store.app.states
    }
  }
})
</script>
