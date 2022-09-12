import { deepClone } from '@/utils'
import SELECT from '../constant/select'
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      SELECT
    }
  },
  computed: mapState({
    batchSelectType: state => state.batch.selectType,
    batchGroupId: state => state.batch.groupId,
    selectsId: state => state.batch.selectsId,
    selectsList: state => state.batch.selectsList,
    listPort: state => state.batch.listPort,
    selectListenPort: state => state.batch.selectListenPort,
    haveWAF: state => state.batch.haveWAF,
    haveCheck: state => state.batch.haveCheck
  }),
  methods: {
    ...mapMutations(['SET_DOMAIN_SELECTS_ID', 'SET_DOMAIN_SELECTS_LIST', 'SET_SELECT_TYPE', 'SET_GROUP_ID']),
    ...mapActions(['domainListInfo']),
    deepClone,
    addReserved(selects, value = '__KEEP__') {
      selects = deepClone(selects)
      selects.unshift({
        label: '保留原配置',
        value
      })
      return selects
    }
  }
}
