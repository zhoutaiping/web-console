import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      adsSettings: state => state.ads.settings,
      adsSelects: state => state.ads.selects,
      adsSelectCluster: state => state.ads.selectCluster,
      adsSelectDefense: state => state.ads.selectDefense,
      adsSelectTemplate: state => state.ads.selectTemplate,
      adsSelectReceiver: state => state.ads.selectReceiver
    }),
    ...mapGetters({
      'adsSelectTemplatePublic': 'ads/selectTemplatePublic',
      'adsSelectTemplatePublicWithId': 'ads/selectTemplatePublicWithId'
    })
  },

  methods: {
    ...mapMutations({
      'ADS_SET_SETTINGS': 'ads/SET_SETTINGS'
    }),
    ...mapActions({
      'adsFetchClusterList': 'ads/fetchClusterList',
      'adsFetchDefenseList': 'ads/fetchDefenseList',
      'adsFetchTemplateList': 'ads/fetchTemplateList',
      'adsFetchReceiverList': 'ads/fetchReceiverList',
      'adsFetchSettings': 'ads/fetchSettings',
      'adsFetchSaveSettings': 'ads/fetchSaveSettings'
    })
  }
}
