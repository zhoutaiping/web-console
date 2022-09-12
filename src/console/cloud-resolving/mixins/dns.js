import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      dnsSelectRecordLine: state => state.dns.selectRecordLine,
      dnsRecordLineList: state => state.dns.recordLineList,
      dnsDomainId: state => state.dns.domainId,
      dnsDomainInfo: state => state.dns.domainInfo,
      dnsSelects: state => state.dns.selects
    })
  },

  methods: {
    ...mapMutations({
      DNS_SET_DOMAIN_ID: 'dns/SET_DOMAIN_ID'
    }),

    ...mapActions({
      'dnsFetchRecordLine': 'dns/fetchRecordLine',
      'dnsFetchDomainInfo': 'dns/fetchDomainInfo'
    })
  }
}
