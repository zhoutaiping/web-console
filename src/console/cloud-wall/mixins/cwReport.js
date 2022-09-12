import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      reportLoadingPackage: state => state.cwReport.loadingPackage,
      reportParams: state => state.cwReport.params,
      reportSelectPort: state => state.cwReport.selectPort,
      reportSelectIP: state => state.cwReport.selectIP,
      utime: state => state.cwReport.utime
    })
  }
}
