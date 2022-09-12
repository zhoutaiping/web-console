<style lang="scss">
.TipsRecord {
  padding: 0 16px;
}
</style>

<template>
  <div :class="b()">
    <DmAlert>
      <template v-if="focus === 'name'">
        <p><strong class="color--primary">提示：要将域名example.com解析为www.example.com,在主机记录（RR）处填写www即可。主机记录就是域名前缀，常见用法有:</strong></p>
        <p>www：解析后的域名为 www.example.cn</p>
        <p>@：直接解析主域名 example.cn</p>
        <p>*：泛解析，匹配其他所有域名 *.example.cn</p>
        <p>bbs：解析后的域名为 bbs.example.cn</p>
        <p>blog：解析后的域名为 blog.example.cn</p>
      </template>
      <template v-else-if="focus === 'mx'">
        <p>优先级：用来指定邮件服务器接收邮件的先后顺序 （1-50），一般默认设置为 5、10、15 等。 提示：我们默认的 600 秒是最常用的，不用修改</p>
      </template>
      <template v-else-if="focus === 'ttl'">
        <p><strong class="color--primary">TTL 即 Time To Live，缓存的生存时间。指地方 dns 缓存您域名记录信息的时间，缓存失效后会再次到 YUNDUN 获取记录值。</strong></p>
        <p>600（10 分钟）：建议正常情况下使用 600。</p>
        <p>60（1 分钟）：如果您经常修改 IP，修改记录一分钟即可生效。长期使用 60，解析速度会略受影响。</p>
        <p>3600（1 小时）：如果您 IP 极少变动（一年几次），建议选择 3600，解析速度快。如果要修改 IP，提前一天改为 60，即可快速生效。</p>
      </template>
      <template v-else>
        <p><strong class="color--primary">提示：要指向空间商提供的 IP 地址，选择「类型 A」，要指向一个域名，选择「类型 CNAME」</strong></p>
        <p>A 记录：地址记录，用来指定域名的 IPv4 地址（如：8.8.8.8），如果需要将域名指向一个 IP 地址，就需要添加 A 记录</p>
        <p>CNAME：如果需要将域名指向另一个域名，再由另一个域名提供 ip 地址，就需要添加 CNAME 记录</p>
        <p>MX：如果需要设置邮箱，让邮箱能收到邮件，就需要添加 MX 记录</p>
        <p>TXT：在这里可以填写任何东西，长度限制 255。绝大多数的 TXT 记录是用来做 SPF记录（反垃圾邮件）</p>
        <p>NS：域名服务器记录，如果需要把子域名交给其他 DNS 服务商解析，就需要添加 NS记录</p>
        <p>AAAA：用来指定主机名（或域名）对应的 IPv6 地址（例如：ff06:0:0:0:0:0:0:c3）记录</p>
        <p>SRV：记录了哪台计算机提供了哪个服务。格式为：服务的名字、点、协议的类型，例如：_xmpp-server._tcp</p>
      </template>
    </DmAlert>
  </div>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'TipsRecord',

  props: {
    type: String,
    focus: {
      type: String,
      default: 'name'
    }
  }
})
</script>
