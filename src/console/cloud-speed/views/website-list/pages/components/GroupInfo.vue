<style lang="scss">
.GroupInfo {
  &__title {
    // border-bottom: 1px dashed $--color-primary;
  }

  .el-icon-loading {
    color: $--color-primary;
  }

  &__list {
    max-height: 380px;
    overflow-x: auto;
    padding: 12px 0;
    padding-bottom: 0px;
  }

  &__popper {
    .item {
      font-size: 12px;
      line-height: 1.7;
      margin-bottom: 2px;

      &:hover {
        .a-console {
          display: inline-block;
        }
      }
      .a-console {
        margin-left: 4px;
        display: none;
      }
    }

    .text--detail {
      font-size: 12px;
      margin-top: 10px;
      text-align: center;
      border-top: 1px solid #eee;
      padding-top: 10px;
      color: #999;
    }
  }
}
</style>

<template>
  <el-popover
    :popper-class="b('popper')"
    :disabled="disabledPopper"
    placement="bototm"
    width="600"
    trigger="hover"
  >
    <div :class="b('list')">
      <yd-scroll>
        <el-row>
          <el-col
            v-for="(item, index) in info.list"
            :span="8"
            :key="index"
            class="item"
          >
            {{ item.domain }}
            <router-link
              :to="{ name: 'cloud-speed.router.websiteList__console__id', params: {id: item.domain_id} }"
              class="a-console"
            >控制台</router-link>
          </el-col>
        </el-row>
      </yd-scroll>

      <template v-if="info.list.length < info.total">
        <div class="text--detail">
          ... 共{{ info.total }} 个域名
        </div>
      </template>
    </div>
    <template slot="reference">
      <a :class="b('title')">
        <template v-if="loading">
          <i class="el-icon-loading" />
        </template>
        <template v-else>
          <template v-if="isNull">
            无域名
          </template>
          <template v-else>
            {{ info.list[0].domain }}... {{ info.total }} 个域名
          </template>
        </template>
      </a>
    </template>
  </el-popover>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'GroupInfo',

  data() {
    return {
      loading: false,
      info: {
        list: []
      },
      disabledPopper: true,
      isNull: true
    }
  },

  methods: {
    async fetchData(group_id) {
      this.loading = true
      const data = await this.Fetch.post('V4/web.domain.group.domain.list', { group_id })
      this.info = data
      this.loading = false

      const isNull = data.list.length === 0
      this.disabledPopper = isNull
      this.isNull = isNull
    }
  }
})
</script>
