<template>
  <div>
    <el-radio-group
      v-model="active"
      class="margin-bottom"
    >
      <el-radio-button
        v-for="(item, index) in navbar"
        :key="index"
        :label="item.name"
      >{{ item.title }}</el-radio-button>
    </el-radio-group>
    <!-- 整站刷新 -->
    <div v-show="active === 'host'">
      <DmAlert>
        <p>1. 请输入需要刷新的域名如：www.demo.com，域名不区分大小写，多个域名请用回车分隔</p>
        <p>2. 非本账号下的域名将被忽略</p>
        <p>3. 不支持泛域名清理缓存，需输入具体域名进行清理</p>
        <p>4. 单账号每分钟仅支持添加2次整站刷新任务，单次最多支持200条，且重复的域名将被忽略</p>
      </DmAlert>
      <yd-card
        class="margin-top"
        grey
      >
        <el-form>
          <el-form-item>
            <el-input
              v-loading="loading"
              :rows="20"
              v-model="wholesite"
              class="textarea_style"
              type="textarea"
              placeholder="整站刷新"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              style="width: 100px"
              type="primary"
              @click="handerRefreshHost"
            >刷新</el-button>
          </el-form-item>
        </el-form>
      </yd-card>
    </div>
    <!-- URL 刷新 -->
    <div v-show="active === 'url'">
      <DmAlert>
        <p>1. 请输入需要刷新的URL，以http(s)://开头，如：http://www.demo.com/img.png，URL不区分大小写，多个URL请用回车分隔</p>
        <p>2. 非本账号下的域名URL将被忽略</p>
        <p>3. 不支持泛域名URL清理缓存，需输入具体域名URL进行清理</p>
        <p>4. 单账号每分钟仅支持添加2次URL刷新任务，单次最多支持200条，且重复的URL将被忽略</p>
      </DmAlert>
      <yd-card
        class="margin-top"
        grey
      >
        <el-form>
          <el-form-item>
            <el-input
              :rows="20"
              v-model="specialurl"
              type="textarea"
              placeholder="指定URL刷新"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width: 100px"
              @click="handleRefreshUrl"
            >刷新</el-button>
          </el-form-item>
        </el-form>
      </yd-card>
    </div>
    <!-- 目录刷新 -->
    <div v-show="active === 'menu'">
      <DmAlert>
        <p>1. 请输入需要刷新的目录，以http(s)://开头，以/结束，目录不区分大小写，多个目录请用回车分隔，最多支持八级目录</p>
        <p>2. 非本账号下的域名目录将被忽略</p>
        <p>3. 不支持泛域名目录清理缓存，需输入具体目录进行清理</p>
        <p>4. 单账号每分钟仅支持添加2次目录刷新任务，单次最多支持100条，且重复的目录将被忽略</p>
      </DmAlert>
      <yd-card
        class="margin-top"
        grey
      >
        <el-form>
          <el-form-item>
            <el-input
              :rows="20"
              v-model="menus"
              class="textarea_style"
              type="textarea"
              placeholder="指定目录刷新"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width: 100px"
              @click="handerRefreshMenu"
            >刷新</el-button>
          </el-form-item>
        </el-form>
      </yd-card>
    </div>
  </div>
</template>

<script>
import Rule from '@/utils/verify'
const MAX_LIMIT = 200

export default {
  data() {
    return {
      MAX_LIMIT,
      active: 'host',
      navbar: [
        {
          title: '整站刷新',
          name: 'host'
        },
        {
          title: '指定URL刷新',
          name: 'url'
        },
        {
          title: '指定目录刷新',
          name: 'menu'
        }
      ],
      wholesite: '',
      specialurl: '',
      menus: '',
      site_val: '',
      loading: true
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    validateList(list, { limit = MAX_LIMIT } = {}) {
      list = list.split('\n').filter(Boolean)
      if (list.length !== new Set(list).size) {
        this.$message.warning('请检查重复项')
        throw new Error()
      }

      if (list.length > limit) {
        this.$message.warning(`最多支持 ${limit} 条`)
        throw new Error()
      }

      for (const item of list) {
        const domain = item.replace(/https:\/\/|http:\/\//, '').split('/')[0]
        if (domain[0] === '*') {
          this.$message.warning(`不支持泛域名`)
          throw new Error()
        }
      }

      return list
    },
    // 整站刷新
    async handerRefreshHost() {
      const wholesite = this.validateList(this.wholesite)

      for (const item of wholesite) {
        if (!Rule.domain.test(item)) {
          this.$message.warning('格式有误')
          return
        }
      }

      this.fetchRefresh({
        wholesite
      })
    },
    // 目录刷新
    handerRefreshMenu() {
      const specialdir = this.validateList(this.menus)
      for (const item of specialdir) {
        if (!Rule.urlMenu.test(item)) {
          this.$message.warning('格式有误')
          return
        }
      }

      this.fetchRefresh({
        specialdir
      })
    },
    // URL 刷新
    handleRefreshUrl() {
      const specialurl = this.validateList(this.specialurl)
      for (const item of specialurl) {
        if (!Rule.defaultUrl.test(item)) {
          this.$message.warning('格式有误')
          return
        }
      }

      this.fetchRefresh({
        specialurl
      })
    },

    async fetchRefresh(params) {
      try {
        await this.Fetch.put('V4/Web.Domain.DashBoard.saveCache', params)
      } catch (e) {
        return
      }

      this.Message('ACTION_SUCCESS')
      this.fetchData()
    },

    async fetchData() {
      let data
      try {
        data = await this.Fetch.get('V4/Web.Domain.DashBoard.getCache')
      } catch (e) {
        return
      } finally {
        this.loading = false
      }

      this.wholesite = data.wholesite.join('\n')
      this.specialurl = data.specialurl.join('\n')
      this.menus = data.specialdir.join('\n')
    }
  }
}
</script>
