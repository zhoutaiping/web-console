<template>
  <CardChart
    :loading="loading"
    :data="data"
    :tooltip="tooltip"
    :settings="settings"
    :title="title"
    :y-axis="yAxis"
    height="350px"
  >
    {{ settings }}
    <template slot="extra">
      <slot name="extra"/>
    </template>
  </CardChart>
</template>

<script>

export default {
  name: 'CardChartVisit',
  props: {
    title: String,
    loading: Boolean,
    data: Object,
    tooltip: Object,
    settings: Object,
    yAxis: Object
  }
}
</script>
