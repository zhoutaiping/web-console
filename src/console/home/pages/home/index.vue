<template>
  <ConsolePageLayout
    :breadcrumb-visible="false"
    :header-visible="false"
  >
    <HeaderAlert v-if="appName === 'yundun'" />
    <HeaderOverflow v-if="moduleSettings['home'].showFinance" />
    <div class="margin-top">
      <el-row :gutter="16">
        <el-col :span="16">
          <CardSafeData />
          <CardChartFlow class="margin-top" />
          <CardOpenService class="margin-top" />
        </el-col>
        <el-col :span="8">
          <CardCarousel
            v-if="moduleSettings['home'].carousel.length"
            :items="moduleSettings['home'].carousel"
            class="margin-bottom"
          />
          <CardUsed />
          <CardMessages class="margin-top" />
        </el-col>
      </el-row>
    </div>
  </ConsolePageLayout>
</template>

<script>
import HeaderOverflow from './components/HeaderOverflow'
import HeaderAlert from './components/HeaderAlert'
import CardCarousel from './components/CardCarousel'
import CardUsed from './components/CardUsed'
import CardOpenService from './components/CardOpenService'
import CardSafeData from './components/CardSafeData'
import CardMessages from './components/CardMessages'
import CardChartFlow from './components/CardChartFlow'

export default {
  components: {
    HeaderOverflow,
    HeaderAlert,
    CardCarousel,
    CardUsed,
    CardOpenService,
    CardSafeData,
    CardMessages,
    CardChartFlow
  }
}
</script>
