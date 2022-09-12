const DATA = {
  CloudWaf: {
    key: 'cloud_waf'
  },
  ContentReplace: {
    key: 'content_replace'
  },
  DefenseCC: {
    key: 'anti_cc'
  },
  DefenseRefer: {
    key: 'anti_refer'
  },
  WAF: {
    key: 'firewall'
  },
  WafIntercept: {
    key: 'waf_block_diy_page'
  },
  WebHoney: {
    key: 'web_honeypot'
  },
  WebSnapshot: {
    key: 'safe_snap'
  },
  ZoneLimit: {
    key: 'zone_limit'
  },
  SourceSafe: {
    key: 'source_site_protect'
  },
  DomainNode: {
    key: 'protected_status'
  },
  ProtectedMode: {
    key: 'access_mode'
  },
  Source: {
    key: 'listen_port'
  },
  Slice: {
    key: 'slice'
  },
  WebP: {
    key: 'WebP'
  },
  Mobile: {
    key: 'mobile_jump'
  },
  Browser: {
    key: 'browser_cache'
  },
  Https: {
    key: 'https'
  },
  WebSocket: {
    key: 'websocket'
  },
  Page404: {
    key: 'diy_page_404'
  },
  Page500: {
    key: 'diy_page_500'
  },
  Page502: {
    key: 'diy_page_502_or_504'
  },
  HttpHeader: {
    key: 'resp_headers'
  },
  HttpSourceHeader: {
    key: 'customized_req_headers'
  },
  CdnCache: {
    key: 'cdn_advance_cache'
  },
  BackSourceSni: {
    key: 'back_source_sni'
  },
  BackSourceHost: {
    key: 'back_source_host'
  }
}

const KEY_MAP = (function () {
  const data = {}
  Object.keys(DATA).forEach(name => {
    data[DATA[name].key] = name
  })

  return data
}())

export default DATA
export { KEY_MAP }
