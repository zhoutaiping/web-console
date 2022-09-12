<template>
  <div>
    <!--  -->
    <DmToolbar>
      <router-link :to="{name: 'cloud-speed.router.menaceAnalyze__CCAttack'}">
        <el-button>返回</el-button>
      </router-link>
    </DmToolbar>
    <DmCard>
      <el-form
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="业务">{{ $route.query.sub_domain }}</el-form-item>
        <el-form-item label="开始时间">{{ $route.query.start_time }}</el-form-item>
        <el-form-item label="结束时间">{{ $route.query.end_time }}</el-form-item>
        <el-form-item label="攻击总次数">{{ $route.query.attack_cnt }}</el-form-item>
      </el-form>
    </DmCard>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            prop="ip"
            label="攻击IP"
            min-width="180"
          />
          <el-table-column
            prop="url"
            label="URL"
            min-width="200"
          />
          <el-table-column
            prop="ua"
            label="User-Agent"
            min-width="200"
          />
          <el-table-column
            prop="status"
            label="状态码"
            min-width="100"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'

export default {
  mixins: [consoleData],

  data() {
    return {
      API_METHOD: 'post',
      API_INDEX: 'V4/stati.data.get',
      bindParams: {
        router: 'cc.attack.event.detail'
      }
    }
  },

  methods: {
    formatParams(params) {
      return {
        ...params,
        sub_domains: [this.$route.query.sub_domain],
        start_time: this.$route.query.start_time,
        end_time: this.$route.query.end_time
      }
    },
    formatResponse(response) {
      return response
      // const data = { 'status': { 'code': 200, 'message': 'SUCCESS', 'time_comsuming': '0' }, 'data': { 'total': 2000, 'list': [{ 'ip': '223.104.159.216', 'url': 'https://jkxg.fseihapq.com:28025/resource/zip/sound/tw_baccarat_sound.zp?v=GH5N_v1.0.5.0.20211122.release', 'ua': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 kk_hybrid', 'status': 200 }, { 'ip': '223.104.159.216', 'url': 'https://jkxg.fseihapq.com:28025/resource/assets/common/chat/chat2_atlas.json?v=GH5N_v1.0.5.0.20211122.release', 'ua': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 kk_hybrid', 'status': 200 }, { 'ip': '223.104.159.216', 'url': 'https://jkxg.fseihapq.com:28025/resource/assets/image/live_hall/hall_live_atlas.png?v=GH5N_v1.0.5.0.20211122.release', 'ua': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 kk_hybrid', 'status': 200 }, { 'ip': '223.104.159.216', 'url': 'https://jkxg.fseihapq.com:28025/resource/assets/common/chat/chat2_atlas.png?v=GH5N_v1.0.5.0.20211122.release', 'ua': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 kk_hybrid', 'status': 200 }, { 'ip': '223.104.159.216', 'url': 'https://jkxg.fseihapq.com:28025/resource/zip/sound/tw_baccarat_enter.zp?v=GH5N_v1.0.5.0.20211122.release', 'ua': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 kk_hybrid', 'status': 200 }, { 'ip': '223.104.159.216', 'url': 'https://jkxg.fseihapq.com:28025/resource/assets/common/chat/chat.png?v=GH5N_v1.0.5.0.20211122.release', 'ua': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 kk_hybrid', 'status': 200 }, { 'ip': '223.104.159.216', 'url': 'https://jkxg.fseihapq.com:28025/resource/assets/common/common/livetxt_cn.json?v=GH5N_v1.0.5.0.20211122.release', 'ua': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 kk_hybrid', 'status': 200 }, { 'ip': '223.104.159.216', 'url': 'https://jkxg.fseihapq.com:28025/resource/assets/image/baccarat/big_static_base.png?v=GH5N_v1.0.5.0.20211122.release', 'ua': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 kk_hybrid', 'status': 200 }, { 'ip': '223.104.159.216', 'url': 'https://jkxg.fseihapq.com:28025/resource/assets/image/baccarat/big_static_base.json?v=GH5N_v1.0.5.0.20211122.release', 'ua': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 kk_hybrid', 'status': 200 }, { 'ip': '223.104.159.216', 'url': 'https://jkxg.fseihapq.com:28025/resource/assets/image/live_hall/hall_live_atlas.json?v=GH5N_v1.0.5.0.20211122.release', 'ua': 'Mozilla/5.0 (Linux; Android 10; HMA-AL00 Build/HUAWEIHMA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.106 Mobile Safari/537.36 kk_hybrid', 'status': 200 }] }}
      // return { list: data.data.list }
    }
  }
}
</script>
