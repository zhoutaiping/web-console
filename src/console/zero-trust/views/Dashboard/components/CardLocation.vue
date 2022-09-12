<style lang="scss" scoped>
.CardMap{
  position: relative;
  .total {
    position: absolute;
    right: 12px;
    top: 12px;
    width: 54px;
    height: 54px;
    background: linear-gradient(-45deg, #0c74d4, #0888f3);
    border-radius: 14px;
    text-align: center;
    color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    p{
      font-size: 12px;
      margin-bottom: 0px;
    }

    strong{
      font-size: 20px;
    }
  }
}
</style>

<template>
  <DmCard
    :loading="loading"
    title="登录用户地理位置分布"
  >
    <el-row>
      <el-col :span="16" class="CardMap">
        <ChartMap
          :data="data"
          :options="options"
          :extend="extend"
          :height="550"
          :loading="false"
          :data-empty="!loading && !data.rows && !data.rows.length"
        />
        <div class="total">
          <p>Total</p>
          <strong>{{ total }}</strong>
        </div>
      </el-col>
      <el-col :span="8">
        <DmCard
          :border="false"
          title="登录用户分布"
        >
          <ItemNumberLite
            v-for="(item, index) in top10"
            :key="index"
            :progress-percent="Number(item.percent)"
            :title="item.name"
            progress
          >
            {{ item.value }}
          </ItemNumberLite>
        </DmCard>
      </el-col>
    </el-row>
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'
import ChartMap from '@/components/Chart/ChartMap'
import ItemNumberLite from '@/components/Item/ItemNumberLite'
import SelectDaterange from '@/components/Select/SelectDaterange'
import moment from 'moment'

export default create({
  components: { ChartMap, ItemNumberLite, SelectDaterange },

  props: {
    title: String,
    loading: Boolean
  },

  data() {
    return {
      data: {},
      options: {},
      extend: {},
      bindParams: {
        dateRange: [moment().subtract(29, 'days'), moment()]
      },
      top10: [],
      total: 0
    }
  },

  methods: {
    async setTotal(total) {
      this.total = total
    },

    async setTop(rows) {
      this.top10 = rows
    },

    async setData(rows) {
      this.data = {
        columns: ['name', 'value', 'percent'],
        rows
      }

      this.options = {
        labelMap: {
          value: '认证用户数'
        },
        position: 'china',
        max: rows.length ? Math.max(...rows.map(_ => _.value)) : 1
      }
    }
  }
})
</script>
