<style lang="scss">
.LoginPagePreview {
  padding: 10px 20px;
  padding-bottom: 50px;
  background-size: 100%;
  height: 300px;

  &__logo {
    width: 40px;
    height: 40px;
    margin: 0 auto;
  }

  &__title {
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    margin-top: 50px;
    margin-bottom: 20px;
  }

  &__content {
    background: rgba(255, 255, 255, .9);
    border-top: 4px solid $--color-primary;
    border-radius: 4px;
    width: 250px;
    padding: 15px 30px;
    margin: 0 auto;
    text-align: center;
  }

  &__button {
    width: 100%;
  }
}
</style>

<template>
  <div
    :class="b()"
    :style="{'background-color': data.login_design_background_color, 'background-image': `url(${data.login_design_background_pic})`}"
  >
    <div :class="b('header')">
      <el-image
        :src="data.login_design_logo"
        :class="b('logo')"
        fit="contain"
      >
        <div
          slot="error"
          class="image-slot"
        >
          <i class="el-icon-picture-outline" />
        </div>
      </el-image>
    </div>
    <div>
      <el-row>
        <el-col :span="12">
          <div style="text-align: center">
            <div
              :class="b('title')"
              :style="{'color': data.login_design_text_color}"
            >
              {{ data.login_design_title || 'Login' }}
            </div>
            <a-button
              type="primary"
            >立即登录</a-button>
          </div>
        </el-col>
        <!-- <el-col :span="12">
          <el-form :class="b('content')">
            <el-form-item>
              <el-input
                size="mini"
                placeholder="用户名"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                size="mini"
                placeholder="密码"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                :class="b('button')"
                type="primary"
              >登录</el-button>
            </el-form-item>
          </el-form>
        </el-col> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'LoginPagePreview',

  props: {
    data: Object
  }
})
</script>
