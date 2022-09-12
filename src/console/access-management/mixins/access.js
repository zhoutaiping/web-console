import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState({
    selectUser: state => state.access.selectUser,
    selectStrategy: state => state.access.selectStrategy,
    selectGroup: state => state.access.selectGroup,
    settingList: state => state.access.settingList,
    selectDomain: state => state.access.selectDomain,
    settingTabs: state => state.access.settingTabs,
    domainsMap: state => state.access.domainsMap
  }),
  methods: {
    ...mapActions(['fetchUsers', 'fetchstrategy', 'fetchGroup', 'fetchDomain', 'fetchSettingList'])
  }
}
