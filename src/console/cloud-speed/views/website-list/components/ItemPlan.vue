<template>
  <span :class="b()">
    <el-popover
      placement="top-bottom"
      width="230"
      trigger="hover"
    >
      <p style="font-size: 12px">当前版本：{{ data.plan_name || '--' }}</p>
      <p v-if="data.meal_flag !== 'YD-WEBAQJS-TY'" style="font-size: 12px">到期时间：{{ data.expire_time }}</p>
      <div>
        <div v-for="(btn, _index) in option.btn_select[index]" :key="_index" style="display:inline-block;">
          <el-button
            size="mini"
            @click="hanleClick(btn.value, data.meal_flag)"
          >{{ btn.label }}</el-button>
          <el-divider v-if="option.btn_select[index].length-_index -1>0" direction="vertical" />
        </div>
      </div>
      <el-button
        slot="reference"
        type="text"
      >{{ data.plan_name }}</el-button>
    </el-popover>
  </span>
</template>

<script>
import create from '@/utils/create-basic'
import mealMixis from '../../../mixins/website-meal-mixins'

export default create({
  name: 'ItemPlan',
  mixins: [mealMixis],
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    index() {
      let val = 0
      const data = this.data
      if (data && Object.keys(data).length) {
        val = this.meals.findIndex(i => { return i === data.meal_flag })
      }
      return val
    }
  },

  methods: {
    hanleClick(value = '', flag = this.data.meal_flag || '') {
      if (flag === 'YD-WEBAQJS-TY') {
        window.location = '/webscdn-buy'
      } else if (flag === 'YD-WEBAQJS-DZ') {
        this.Help.openServicePanel(this.appAssets.afterKF)
      } else {
        this.$emit('open', value)
      }
    }
  }
})
</script>
