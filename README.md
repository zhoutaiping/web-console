# 云盾用户控制台

#### 启动项目
```sh
npm i
npm run start
npm run start:pre 预发布环境
npm run start:prod 正式环境
```
#### 编译
```sh
npm run build

npm run build:docker 编译docker版本
```

### 单元测试

测试单个文件 

cross-env APP_ENV=jest jest /src/components/Dm/__tests__/DmData.spec.js

## 关于分支
- dev: 日常开发分支
- tester: 测试分支，自动编译至测试环境（YUNDUN 仓库生效），自动编译 Docker（Baishan 仓库生效）
- oem OEM: 分支，自动编译至 OEM 环境（YUNDUN 仓库生效），**此分支不能合并至 dev 和 tester**

## 同步仓库
- https://git.nodevops.cn/frontend-team/console-v5-web
- http://jr.baishancloud.com:7990/projects/BAISHANONE/repos/yundun-home-console-fe

## 目录结构

<div class="file-tree">
  <div class="item">src</div>
  <div class="children">
    <div class="item">api</div>
    <div class="item">core</div>
    <div class="item">config</div>
    <div class="item">mixins</div>
    <div class="item">store</div>
    <div class="item">utils</div>
  </div>
</div>

|     |         |
| ------------ | -------------------------------------------------------------- |
| `src.api`      | Api 接口 |
| `src.core`      | 初始化方法，核心依赖 |
| `src.config`      | 配置项 |
| `src.mixins`      | 混入 |
| `src.store`      | Vuex |

### src.core

<div class="file-tree">
  <div class="item">core</div>
  <div class="children">
    <div class="item">lang</div>
    <div class="item">locale</div>
    <div class="item">config</div>
    <div class="item">mixins</div>
    <div class="item">store</div>
    <div class="item">utils</div>
  </div>
</div>


<style>
.file-tree {
  background: #f9f9f9;
  border: 4px solid #f5f5f5;
  margin: 40px 0;
  padding: 16px 32px;
}

.file-tree.item {
  display: block;
  line-height: 32px;
  font-size: 15px;
  color: #5a5a5a;
}

.file-tree .children {
  padding-left: 30px;
  position: relative;
  overflow: hidden;
}

.file-tree .item {
  position: relative;
}

.file-tree  .item:before {
  content: '';
  left: -18px;
  bottom: 16px;
  width: 16px;
  height: 9999px;
  position: absolute;
  border-width: 0 0 1px 1px;
  border-style: solid;
  border-color: #dbdbdb;
  border-radius: 0 0 0 3px;
}
</style>


<!-- docker build -t harbor-jh.bs58i.baishancdnx.com/frontend/yundun-home-console-fe .
docker push harbor-jh.bs58i.baishancdnx.com/frontend/yundun-home-console-fe -->