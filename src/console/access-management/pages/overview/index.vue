<style lang="scss" scoped>
.overviewPage {
  .CardTips {
    li {
      margin-bottom: 20px;

      .title {
        font-size: 14px;
        margin-bottom: 4px;
      }

      .desc {
        color: rgba(0, 0, 0, 0.62);
      }
    }
  }
}
.item-box {
  overflow: hidden;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  text-align: center;
  font-size: 18px;
  &-value {
    display: inline-block;
    margin: 0 10px;
    font-size: 36px;
  }
}

.totalItem-box {
  display: flex;
  &-index {
    width: 30px;
    font-size: 40px;
    font-weight: 600;
    vertical-align: text-top;
  }
  &-desc {
    flex: 1;
    .title {
      font-size: 20px;
      font-weight: 500;
      padding: 10px 0;
      border-bottom: 2px dashed #2991fa;
      margin-bottom: 10px;
      .right-boder {
        width: 0;
        height: 0;
        border-left: 10px solid #2991fa;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        float: right;
        margin-top: 31px;
      }
    }
  }
}
</style>

<template>
  <console-page-layout class="overviewPage">
    <DmAlert>
      权限管理为您提供在 {{ appAssets.companyEN }} 平台上的资源访问控制服务。通过权限管理对用户进行赋权，可以使特定用户获得管理此账号的相关能力。
    </DmAlert>
    <DmCard title="基本信息">
      <el-form label-position="left">
        <el-form-item label="主账号：">
          <strong>
            {{ userInfo.email }}
          </strong>
        </el-form-item>
        <el-form-item label="子账号登录地址" />
        <el-form-item>
          <a
            :href="subLoginUrl"
            target="_blank"
          >
            {{ subLoginUrl }}
          </a>
          <ItemCopy :value="subLoginUrl" />
        </el-form-item>
      </el-form>
    </DmCard>
    <DmCard
      title="概览"
      class="margin-top"
    >
      <el-row :gutter="12">
        <el-col :span="12">
          <div
            class="item-box"
            style="border-right:1px solid #bbb;"
          >
            子账号
            <span class="item-box-value color--primary">
              {{ info.SubUsersCount }}
            </span>
            个
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item-box">
            组织
            <span class="item-box-value color--primary">
              {{ info.SubUserGroupsCount }}
            </span>
            个
          </div>
        </el-col>

      </el-row>
    </DmCard>
    <DmCard
      title="操作指引"
      class="margin-top CardTips"
    >
      <el-row :gutter="50">
        <el-col
          v-for="(item, index) in totalDesc"
          :span="24/totalDesc.length"
          :key="index"
        >
          <div class="totalItem-box">
            <div class="totalItem-box-index color--primary">
              {{ index + 1 }}
            </div>
            <div class="totalItem-box-desc">
              <div class="title">
                {{ item.title }}
                <div
                  v-show="index !==totalDesc.length-1"
                  class="right-boder"
                />
              </div>
              <p class="desc">{{ item.desc }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </DmCard>
  </console-page-layout>
</template>

<script>
import ItemNumber from '@/components/Item/ItemNumber'
import ItemCopy from '@/components/Item/ItemCopy'

export default {
  components: { ItemNumber, ItemCopy },

  data() {
    return {
      info: {},
      totalDesc: [
        {
          title: '创建子账号',
          desc: '创建子账号，您也可以通过将多个子账号添加至一个组织来对其进行管理'
        },
        {
          title: '组织授权',
          desc: '针对创建的组织进行授权，使组织内的子账号具备相关产品模块权限'
        },
        {
          title: '以子账号登录操作',
          desc: '您可通过子账号的特定登录地址，进入仅具有此子账号对应权限菜单的控制台'
        }
      ]
    }
  },

  computed: {
    subLoginUrl() {
      return `http://${window.location.host}/login-child/#/?member_id=${this.userInfo.id}`
    }
  },

  created() {
    this.getUserinfo()
    this.fetchOverview()
  },

  methods: {
    async fetchOverview() {
      const data = await this.Fetch.get('V4/permission.get.permissionOverview')
      this.info = data
    },
    copyOK() {
      this.$message.success('复制成功')
    }
  }
}
</script>
