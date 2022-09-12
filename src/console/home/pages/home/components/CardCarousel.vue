<template>
  <div :class="b()">
    <el-carousel>
      <el-carousel-item
        v-for="(item, index) in items"
        :key="index"
      >
        <el-image
          :src="item.src"
          fit="cover"
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'CardCarousel',

  props: {
    items: Array
  }
})
</script>
