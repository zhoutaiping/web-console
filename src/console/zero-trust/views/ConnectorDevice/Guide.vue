<style lang="scss" scoped>
body {
  letter-spacing: 1px;
}
p {
  font-size: 14px;
  font-weight: 500;
  color: black;
}
.card-box {
  background-color: #dddddd;
}
.desc-box {
  color: #aaaaaa;
}
</style>
<template>
  <ConsolePageLayout title="安装指南">
    <template v-if="mode === 'Docker'">
      <h3>
        连接器设备-Docker安装指南
      </h3>
      <p>
        0.前置操作请在控制台下载最新的镜像连接器配置模板可在控制台复制：
      </p>
      <img
        style=" width: 100%"
        src="/img/zero-trust-docker-1.png"
        alt="zero-trust-docker-1"
      >
      <p class="margin-top ">
        1.将下载的连接器设备镜像导入Docker中： <br>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          <span class="desc-box">
            //安装Docker环境
          </span>
          <br>
          curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun <br>
          <span class="desc-box">
            //直接导入
          </span>
          <br>
          # docker import <镜像url>  connector_centos7:v1.1
        </el-card>
      </p>
      <p>
        2.检查图像是否正确加载，并找到 {{ docker_image_name }}： <br>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          # docker images
        </el-card>
      </p>
      <p>
        3.运行Docker镜像：
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          <span class="desc-box">
            //带环境变量的启动容器
          </span>
          <br>
          docker run -d --name connector_centos7_v1.1 -e template='<连接器设备配置模板>' --restart=always
            <br>
            connector_centos7:v1.1 /bin/bash /connector/start.sh
        </el-card>
      </p>
      <p>
        4.确认基于Docker的容器正在运行：<br>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          # docker ps
        </el-card>
      </p>
      <p>
        5.到YUNDUN控制台查看该连接器是否正常上线：
      </p>
      <img
        style=" width: 100%"
        src="/img/zero-trust-docker-2.png"
        alt="zero-trust-docker-2"
      >
      <p class="margin-top">
        6.进入容器,查询相关状态(可选)：<br>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          # docker exec -it connector_centos7_v1.1 /bin/bash
        </el-card>
      </p>
      <p>
        7.进入Docker容器后退出容器(可选)<br>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          # exit<br>
        </el-card>
        注：连接器设备完成安装后，默认不会开启数据传输，请在YUNDUN控制台针对该台连接器设备进行Approve操作，开启服务状态后连接器设备将正常工作。
      </p>
    </template>
    <template v-else-if="mode === 'VMware'">
      <h3>
        连接器设备-VMware安装指南
      </h3>
      <p>
        0.前置操作请在控制台下载最新的镜像连接器配置模板可在控制台复制：
      </p>
      <img
        style=" width: 100%"
        src="/img/zero-trust-VMware-1.png"
        alt="zero-trust-VMware-1"
      >
      <p>
        <br>
        镜像兼容产品：ESXi 7.0、ESXi 6.7、ESXi 6.7、ESXi 6.5、Fusion 12.x、Fusion 11.x、Fusion 10.x、Workstation 16.x、Workstation 15.x、Workstation 14.x
        <br>镜像网络模式：桥接
        <br> 镜像硬件配置：2C4G 40G
        请按照以下步骤安装并启动连接器设备：
      </p>
      <p>
        1. 下载连接器镜像到目标目录中并解压；
      </p>
      <p>
        2. 导入虚拟机镜像：
      </p>
      <img
        style=" width: 400px"
        src="/img/zero-trust-VMware-2.png"
        alt="zero-trust-VMware-2"
      >
      <p>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          <span class="desc-box">
            //选择打开虚拟机,并选择后缀为 vmx 的镜像初始文件
          </span>
          <br>
          CentOS 7 64 位.vmx <br>
        </el-card>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          如果出现如下提示,则选择"我已移动该虚拟机" <br>
          <img
            style=" width: 400px"
            src="/img/zero-trust-VMware-3.png"
            alt="zero-trust-VMware-3"
          >
        </el-card>

      </p>

      <p>
        3. 检查虚拟机镜像网络是否正常,需要将网络配置为桥接模式：
      </p>
      <el-card
        :body-style="{'line-height': '25px'}"
        shadow="never"
        class="margin-top card-box"
      >
        <img
          style=" width: 600px"
          src="/img/zero-trust-VMware-4.png"
          alt="zero-trust-VMware-4"
        >
      </el-card>

      <p>
        4. 使用初始密码登录虚拟机,root 用户初始密码: connector@CentOS7    并查看当前分配的网络IP：
      </p>
      <el-card
        :body-style="{'line-height': '25px'}"
        shadow="never"
        class="margin-top card-box"
      >
        <img
          style=" width: 800px"
          src="/img/zero-trust-VMware-5.png"
          alt="zero-trust-VMware-5"
        >
      </el-card>

      <p>
        5. 可以通过Xshell等模拟终端进入虚拟机环境,也可以直接在虚拟机控制台操作；
      </p>
      <p> 6. 放置client配置模版即可,client程序随开机已经自动启动：<br>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          <span class="desc-box">
            //将控制台的配置保存到client.conf中即可
          </span>
          <br>
          # echo '$template$' > /connector/client/client.conf
        </el-card>
      </p>
      <p>
        7. 到云盾控制台查看该连接器是否正常上线：</p>
      <el-card
        :body-style="{'line-height': '25px'}"
        shadow="never"
        class="margin-top card-box"
      >
        <img
          style=" width: 100%"
          src="/img/zero-trust-VMware-6.png"
          alt="zero-trust-VMware-6"
        >
      </el-card>

      <p>
        8. 上线后退出虚拟机登陆状态<br>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          #  exit
        </el-card>

        注:连接器设备完成安装后，默认不会开启数据传输，请在YUNDUN控制台针对该台连接器设备进行Approve操作，开启服务状态后连接器设备将正常工作。
      </p>
    </template>
    <template v-else-if="mode === 'tencent'">
      <h3>连接器设备-腾讯云安装指南</h3>
      <p>
        Tips：连接器配置模板可在控制台复制：
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          <img
            style=" width: 100%"
            src="/img/zero-trust-docker-1.png"
            alt="zero-trust-docker-1"
          >
        </el-card>
      </p>

      <p>
        请按照以下步骤安装并启动连接器设备：<br>

        1.新建云服务器CVM实例,自定义配置：；<br>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          ● 计费模式:按需,一般情况建议包年包月<br>
          ● 地域:建议选择靠近客户业务服务器的地域<br>
          ● 实例配置:建议大于等于 2核 4G内存 系统盘50G<br>
          ● 公网带宽: 建议大于等于 3Mbps ,计费模式按需<br>
          <img
            style=" width: 100%; max-width: 900px;"
            src="/img/zero-trust-tenxun-1.png"
            alt="zero-trust-tenxun-1"
          ><br>
          <img
            style=" width: 100%; max-width: 900px;"
            src="/img/zero-trust-tenxun-2.png"
            alt="zero-trust-tenxun-2"
            class="margin-top"
          >
          <p>
            ●  [重要]镜像:选择镜像市场->搜索'应用可信访问'->选择'免费使用'
          </p>
          <img
            style=" width: 100%; max-width: 900px;"
            src="/img/zero-trust-tenxun-3.png"
            alt="zero-trust-tenxun-3"
          >
          <img
            style=" width: 100%; max-width: 900px;"
            src="/img/zero-trust-tenxun-4.png"
            alt="zero-trust-tenxun-4"
            class="margin-top"
          >
          <p>
            ●  新建安全组
          </p>
          <img
            style=" width: 100%; max-width: 900px;"
            src="/img/zero-trust-tenxun-5.png"
            alt="zero-trust-tenxun-5"
          >
          <p>
            ●  设置root账号密码
          </p>
          <img
            style=" width: 100%; max-width: 900px;"
            src="/img/zero-trust-tenxun-6.png"
            alt="zero-trust-tenxun-6"
          >
          <img
            style=" width: 100%; max-width: 900px;"
            src="/img/zero-trust-tenxun-7.png"
            alt="zero-trust-tenxun-7"
            class="margin-top"
          >
          <p>
            ●  确认配置信息并开通
          </p>
          <img
            style=" width: 100%; max-width: 900px;"
            src="/img/zero-trust-tenxun-8.png"
            alt="zero-trust-tenxun-8"
          >
        </el-card>
        <br>
      </p>

      <p>
        2.连接器模版配置：<br>
        <el-card
          :body-style="{'line-height': '25px'}"
          shadow="never"
          class="margin-top card-box"
        >
          <p>
            ●  直接选择在腾讯云控制台点击登录
          </p>
          <img
            style=" width: 100%; max-width: 900px;"
            src="/img/zero-trust-tenxun-9.png"
            alt="zero-trust-tenxun-9"
          >
          <p>
            ●  选择标准登陆方式,输入之前的root密码
          </p>
          <img
            style=" width: 100%; max-width: 900px;"
            src="/img/zero-trust-tenxun-10.png"
            alt="zero-trust-tenxun-10"
          ><br>
          <img
            style=" width: 500px"
            src="/img/zero-trust-tenxun-11.png"
            alt="zero-trust-tenxun-11"
            class="margin-top"
          >
          <p>
            ●  将配置模版通过命令导入到连接器系统内<br>
          </p>
          <div style="background-color: #BBBBBB50;padding:20px;">
            <span class="desc-box">
              //将控制台的配置保存到client.conf中即可</span>
            <br>
            # echo '控制台的配置模版' > /connector/client/client.conf
          </div>

        </el-card>
      </p>
      <img
        style=" width: 800px"
        src="/img/zero-trust-tenxun-12.png"
        alt="zero-trust-tenxun-12"
      >
      <p>
        ●  到云盾控制台查看该连接器是否正常上线
      </p>
      <img
        style=" width: 100%; max-width: 900px;"
        src="/img/zero-trust-tenxun-13.png"
        alt="zero-trust-tenxun-13"
      >
      <p>
        ●  确认正常后,即可退出连接器linux系统登录<br>

      </p>
      注:连接器设备完成安装后，默认不会开启数据传输，请在YUNDUN控制台针对该台连接器设备进行Approve操作，开启服务状态后连接器设备将正常工作。

    </template>
    <template v-else>
      暂无
    </template>
  </ConsolePageLayout>
</template>
<script>
export default {
  data() {
    return {
      docker_image_name: '<docker_image_name>'
    }
  },
  computed: {
    mode() {
      return this.$route.params.Guide || ''
    }
  }
}
</script>
