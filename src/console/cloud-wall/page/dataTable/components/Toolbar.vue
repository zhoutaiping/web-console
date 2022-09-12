<template>
  <DmToolbar>
    <yd-form-select
      :selects="selectPackage"
      v-model="params.package_id"
      style="width: 200px"
      @change="handleChangePackage"
    />
    <template slot="right">
      <SelectAutoRefresh
        v-if="settings.auto && dateType === 'today'"
        @update="handleUpdate"
      />
      <SelectDateFilter
        v-show="settings.date"
        :type.sync="dateType"
        v-model="params"
        @change="handleUpdate"
      />
    </template>
  </DmToolbar>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import SelectDateFilter from '@/components/Select/SelectDateFilter'
import SelectAutoRefresh from '@/components/Select/SelectAutoRefresh'
import cwReport from '../../../mixins/cwReport'

export default {
  components: { SelectDateFilter, SelectAutoRefresh },

  mixins: [cwReport],

  props: {
    settings: {
      type: Object,
      default() {
        return {}
      }
    },
    autoVisible: Boolean,
    dateVisible: Boolean
  },

  data() {
    return {
      dateType: 'today',
      params: {
        package_id: '',
        start_time: '',
        end_time: ''
      }
    }
  },

  computed: {
    ...mapState({
      selectPackage: state => state.cwReport.selectPackage
    })
  },

  watch: {
    $route() {
      this.handleUpdate()
    }
  },

  created() {
    this.init()
  },

  methods: {
    async init() {
      const list = await this.fetchPackageList()
      if (list) {
        const item = list[0]
        this.params.package_id = item.value
        this.handleChangePackage(item.value)
      }
    },

    ...mapMutations({
      CHANGE_PARAMS: 'cwReport/CHANGE_PARAMS'
    }),

    ...mapActions({
      fetchPackageList: 'cwReport/fetchPackageList',
      fetchPackagePort: 'cwReport/fetchPackagePort',
      fetchPackageIP: 'cwReport/fetchPackageIP'
    }),

    handleChangePackage(val) {
      this.fetchPackagePort(val)
      this.fetchPackageIP(val)
      this.handleUpdate()
    },

    handleUpdate() {
      this.CHANGE_PARAMS(this.params)
      this.$emit('update', this.params)
    }
  }
}
</script>
