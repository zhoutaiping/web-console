<style lang="scss">
.UserSettings {
  .SettingList {
    &:last-child {
      border-bottom: none;
      margin-bottom: 0px;
    }
  }
}
</style>

<template>
  <console-page-layout>
    <DmCard
      title="基本资料"
      class="UserSettings"
    >
      <SettingList v-if="isChild">
        <template slot="title">账号名称</template>
        <template
          v-if="userInfo.user_name"
          slot="description"
        >{{ userInfo.user_name }}</template>
        <template
          v-else
          slot="description"
        >
          未绑定</template>
      </SettingList>
      <SettingList v-if="isChild">
        <template slot="title">所属主账号</template>
        <template
          v-if="userInfo.p_name"
          slot="description"
        >{{ userInfo.p_name }}</template>
        <template
          v-else
          slot="description"
        >
          未绑定</template>
      </SettingList>
      <SettingList>
        <template slot="title">账户邮箱</template>
        <template
          v-if="userInfo.bindEmail"
          slot="description"
        >已绑定邮箱：{{ userInfo.email }}</template>
        <template
          v-else
          slot="description"
        >
          未绑定<template v-if="userInfo.email">邮箱：{{ userInfo.email }}</template>
        </template>
        <template
          v-if="!isChild"
          slot="actions"
        >
          <el-button
            v-if="!userInfo.bindEmail"
            type="primary"
            plain
            @click="$refs.DialogEmail.handleOpen(userInfo)"
          >绑定</el-button>
          <el-button
            v-else
            type="primary"
            plain
            @click="$refs.DialogEmail.handleOpen(userInfo)"
          >修改</el-button>
        </template>
      </SettingList>
      <SettingList>
        <template slot="title">手机号码</template>
        <template
          v-if="userInfo.mobile"
          slot="description"
        >
          <template v-if="userInfo.bindMobile === 1">
            已绑定手机：
          </template>
          {{ userInfo.mobile }}
        </template>
        <template
          v-else
          slot="description"
        >
          未绑定
        </template>
        <template
          v-if="!isChild"
          slot="actions"
        >
          <el-button
            v-if="userInfo.bindMobile === 0"
            type="primary"
            plain
            @click="$refs.DialogMobile.handleOpen(userInfo)"
          >绑定</el-button>
          <el-button
            v-else
            type="primary"
            plain
            @click="$refs.DialogMobile.handleOpen(userInfo)"
          >修改</el-button>
        </template>
      </SettingList>
      <!--  -->
      <SettingList>
        <template slot="title">QQ</template>
        <template
          v-if="!userInfo.qq"
          slot="description"
        >未绑定</template>
        <template
          v-else
          slot="description"
        >已绑定QQ：{{ userInfo.qq }}</template>
        <template
          v-if="!isChild"
          slot="actions"
        >
          <el-button
            type="primary"
            plain
            @click="$refs.DialogQQ.handleOpen(userInfo)"
          >修改</el-button>
        </template>
      </SettingList>
      <SettingList v-if="isChild">
        <template slot="title">创建时间</template>
        <template
          v-if="userInfo.created_at"
          slot="description"
        >{{ userInfo.created_at }}</template>
        <template
          v-else
          slot="description"
        > --</template>
      </SettingList>
    </DmCard>
    <DialogEmail
      ref="DialogEmail"
      @init="getUserinfo()"
    />
    <DialogMobile
      ref="DialogMobile"
      @init="getUserinfo()"
    />
    <DialogQQ
      ref="DialogQQ"
      @init="getUserinfo()"
    />
    <DialogWechat
      ref="DialogWechat"
      @init="getUserinfo()"
    />
  </console-page-layout>
</template>

<script>
import DialogQQ from './components/DialogQQ'
import DialogMobile from './components/DialogMobile'
import DialogEmail from './components/DialogEmail'
import DialogWechat from './components/DialogWechat'
import SettingList from './components/SettingList'
import { getUserstore } from '@/utils/auth'
export default {
  components: { DialogQQ, DialogMobile, DialogEmail, DialogWechat, SettingList },
  computed: {
    isChild() {
      const { userType } = getUserstore()
      return userType === 'child'
    }
  },
  methods: {
    async unBindWechat() {
      try {
        await this.Fetch.get('sso/V4/unBindWeiXin')
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
    }
  }
}
</script>
