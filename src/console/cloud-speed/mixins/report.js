import { mapMutations, mapState } from 'vuex'

export default {
  computed: mapState({
    utime: state => state.cdnReport.utime,
    reportParams: state => state.cdnReport.params
  }),

  methods: {
    ...mapMutations(['SET_UTIME', 'SET_PARAMS'])
  }
}
