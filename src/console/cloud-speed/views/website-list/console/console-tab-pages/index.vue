<template>
  <yd-card-list>
    <!-- 搜索引擎优化 -->
    <search-optimize />
    <!-- HTTPS -->
    <https />
    <!-- OcspStapling -->
    <ocsp-stapling />
    <!-- WebSocket -->
    <web-socket />
    <!-- 设置 HTTP 响应头 -->
    <web-header />
    <!-- 自定义 HTTP 回源请求头 -->
    <web-source-header />
    <!-- 500页面定制 -->
    <page500 />
    <!-- 502/504页面定制 -->
    <page502 />
    <!-- 404页面定制 -->
    <page404 />
  </yd-card-list>
</template>

<script>
import SearchOptimize from './search-optimize'
import Https from './https'
import OcspStapling from './ocsp-stapling'
import WebSocket from './web-socket'
import WebHeader from './web-header'
import WebSourceHeader from './web-source-header'
import Page500 from './page500'
import Page502 from './page502'
import Page404 from './page404'
export default {
  components: {
    SearchOptimize,
    Https,
    OcspStapling,
    WebSocket,
    WebHeader,
    WebSourceHeader,
    Page500,
    Page502,
    Page404
  },

  props: {
    info: Object,
    packageConfig: Array
  },

  mounted() {
    this.domainFetchSettings(['search_engine_optimization', 'https', 'hsts', 'websocket', 'resp_headers', 'customized_req_headers', 'diy_page_500', 'diy_page_502_or_504', 'diy_page_404'])
  }
}
</script>
