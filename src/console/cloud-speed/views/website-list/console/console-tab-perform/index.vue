<template>
  <yd-card-list>
    <!-- 高级缓存 -->
    <cdn-cache />
    <!-- 页面压缩 -->
    <page-gzip />
    <!-- 最大文件上传大小 -->
    <UploadFile />
    <!-- WebP优化 -->
    <webp-adapt />
    <!-- 页面优化 -->
    <page-optimize />
    <!-- 异步加载 -->
    <ajax-load />
    <!-- 全链路优化 -->
    <all-link />
    <!-- 移动端跳转 -->
    <mobile-jump />
    <!-- 永远在线 -->
    <always-online />
    <!-- 浏览器缓存 -->
    <browser-cache />
  </yd-card-list>
</template>

<script>
import CdnCache from './cdn-cache'
import PageGzip from './page-gzip'
import WebpAdapt from './webp-adapt'
import PageOptimize from './page-optimize'
import AjaxLoad from './ajax-load'
import UploadFile from './upload-file'
import AllLink from './all-link'
import MobileJump from './mobile-jump'
import AlwaysOnline from './always-online'
import BrowserCache from './browser-cache'

export default {
  components: {
    CdnCache,
    PageGzip,
    WebpAdapt,
    PageOptimize,
    AjaxLoad,
    UploadFile,
    AllLink,
    MobileJump,
    AlwaysOnline,
    BrowserCache
  },

  mounted() {
    this.domainFetchSettings([
      'cdn_advance_cache',
      'page_gzip',
      'WebP',
      'page_optimization',
      'ajax_load',
      'all_view_optimization',
      'mobile_jump',
      'always_online',
      'browser_cache',
      'upload_file'
    ])
  }
}
</script>
