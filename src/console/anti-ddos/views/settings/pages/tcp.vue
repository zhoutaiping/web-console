<template>
  <div>
    <!-- 连接阻断 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="连接阻断"
    >
      <template slot="tips">将TCP报文全部丢弃，开启后其下所有策略将不在生效</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.dropTcpAllSwitch"
        @change="adsFetchSaveSettings"
      />
    </CardItemForm>
    <!-- 源站学习 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="源站学习"
    >
      <template slot="tips">源站自学习功能</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.srcStationAutoLearnSwitch"
        @change="adsFetchSaveSettings"
      />
    </CardItemForm>
    <!-- 目的IP TCP限速 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="目的IP TCP限速"
    >
      <template slot="tips">将到目的IP地址的所有TCP报文的流量限制在阈值范围内</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.tcpBpsLimitSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="限速阈值">
          <el-input-number
            v-model="adsSettings.tcpBpsLimit"
            :min="0"
            :max="100000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >Mbps（阈值范围：0-100,000）</span>
        </el-form-item>
      </el-form>
    </CardItemForm>
    <!-- 源IP TCP限速 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="源IP TCP限速"
    >
      <template slot="tips">将源IP所有TCP报文的流量限制在阈值范围内</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.srcPpsLimitSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="限速阈值">
          <el-input-number
            v-model="adsSettings.srcPpsLimit"
            :min="0"
            :max="100000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-100,000）</span>
        </el-form-item>
      </el-form>
    </CardItemForm>
    <!-- TCP异常报文防御 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="TCP异常报文防御"
    >
      <template slot="tips">针对TCP异常报文进行检测，针对异常报文进行丢弃</template>
      <DmAlert>
        1. TCP Flag 非法防御：检查TCP报文的各个标志位URG、ACK、PSH、RST、SYN、FIN，如果标志位异常，则认为是TCP异常报文。 当TCP异常报文的速率大于“包速率阈值”时，将所有TCP异常报文全部丢弃<br>
        2.SYN包非法防御：SYN包中如果不存在OPTION字段就丢弃
      </DmAlert>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.tcpAbnormalSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-checkbox v-model="adsSettings.tcpFlagInvalidProtectSwitch">TCP Flag 非法防御</el-checkbox>
      <el-checkbox v-model="adsSettings.dropNoMssAllSwitch">SYN包 非法防御</el-checkbox>
    </CardItemForm>
    <!-- SYN Flood 防御 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="SYN Flood 防御"
    >
      <template slot="tips">针对 SYN Flood 攻击流量进行防御</template>
      <!-- synProtectionSwitch -->
      <SelectSwitch
        slot="action"
        :value="true"
        disabled
        @change="adsFetchSaveSettings"
      />
      <DmAlert>
        1. 包速率阈值：达到包速率阈值后进行相关认证方式<br>
        2. SYN报文个数限速阈值：超过阈值的报文将直接丢弃<br>
        2. 源IP加入黑名单：源IP请求速率达到设置后将源IP加入IP黑名单
      </DmAlert>
      <el-form
        label-position="left"
        label-width="150px"
      >
        <el-form-item label="包速率阈值">
          <el-input-number
            v-model="adsSettings.synPpsThreshold"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-10,000,000）</span>
        </el-form-item>
        <el-form-item label="认证方式">
          <yd-form-radio
            :radios="selectSynProtectionAlg"
            v-model="adsSettings.synProtectionAlg"
          />
        </el-form-item>
        <el-form-item label="目的IP SYN报文限速">
          <el-input-number
            v-model="adsSettings.synPpsLimit"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >个（阈值范围：0-10,000,000）</span>
        </el-form-item>
        <el-form-item label="源IP SYN报文限速">
          <el-input-number
            v-model="adsSettings.srcSynPpsLimit"
            :min="0"
            :max="10000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >个（阈值范围：0-10,000）</span>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="adsSettings.srcSynAutoForbidSwitch">源IP加入黑名单</el-checkbox>
        </el-form-item>
        <el-form-item v-if="adsSettings.srcSynAutoForbidSwitch">
          <el-input-number
            v-model="adsSettings.srcSynStatsTime"
            :min="0"
            :max="60"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >秒（范围：0-60）</span>
          <el-input-number
            v-model="adsSettings.srcSynPpsMax"
            :min="0"
            :max="1000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >SYN包数量（范围：0-1,000,000）</span>
        </el-form-item>
      </el-form>
    </CardItemForm>
    <!-- SYN-ACK Flood 防御 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="SYN-ACK Flood 防御"
    >
      <template slot="tips">当 SYN-ACK 报文的速率达到“包速率阈值”后启动防御</template>
      <!-- v-model="adsSettings.synAckProtectionSwitch" -->
      <SelectSwitch
        slot="action"
        :value="true"
        disabled
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="包速率阈值">
          <el-input-number
            v-model="adsSettings.synAckPpsThreshold"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-10,000,000）</span>
        </el-form-item>
        <el-form-item label="包速率限速">
          <el-input-number
            v-model="adsSettings.synAckPpsLimit"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-10,000,000）</span>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form>
        <el-form-item>
          <el-checkbox v-model="adsSettings.synAckPortFilterSwitch">目的端口过滤</el-checkbox>
        </el-form-item>
        <el-form-item v-if="adsSettings.synAckPortFilterSwitch">
          <el-input-number
            v-model="adsSettings.synAckPortStart"
            :min="0"
            :max="65535"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >最小值</span>
          <el-input-number
            v-model="adsSettings.synAckPortEnd"
            :min="0"
            :max="65535"
            style="margin-left: 10px"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >最大值</span>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="adsSettings.synAckEnhanceProtectionSwitch">增强防御</el-checkbox>
        </el-form-item>
        <el-form-item v-if="adsSettings.synAckEnhanceProtectionSwitch">
          <el-input-number
            v-model="adsSettings.synAckEnhancePpsThreshold"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >增强防御阈值（范围：0-10,000,000）</span>
        </el-form-item>
      </el-form>
    </CardItemForm>
    <!-- ACK Flood 防御 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="ACK Flood 防御"
    >
      <template slot="tips">当ACK报文的速率大于“包速率阈值”时，启动防御，默认防御模式为严格模式</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.ackProtectionSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="包速率阈值">
          <el-input-number
            v-model="adsSettings.ackPpsThreshold"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-10,000,000）</span>
        </el-form-item>
        <el-form-item label="防御模式">
          <yd-form-radio
            :radios="selects.ackProtectionAlg"
            v-model="adsSettings.ackProtectionAlg"
          />
        </el-form-item>
      </el-form>
    </CardItemForm>
    <!-- FIN/RST Flood防御 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="FIN/RST Flood防御"
    >
      <template slot="tips">当 FIN/RST 报文的速率达到“包速率阈值”后启动防御</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.finRstProtectionSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="包速率阈值">
          <el-input-number
            v-model="adsSettings.finRstPpsThreshold"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-10,000,000）</span>
        </el-form-item>
      </el-form>
    </CardItemForm>
    <!-- TCP 分片攻击防御 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="TCP 分片攻击防御"
    >
      <template slot="tips">当达到阈值后进行防御，同时对滤后流量进行限速</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.tcpFragmentSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="阈值">
          <el-input-number
            v-model="adsSettings.tcpFragmentPpsThreshold"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-10,000,000）</span>
        </el-form-item>
        <el-form-item label="限速">
          <el-input-number
            v-model="adsSettings.tcpFragmentPpsLimit"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >pps（阈值范围：0-10,000,000）</span>
        </el-form-item>
      </el-form>
    </CardItemForm>
    <!-- TCP 连接耗尽攻击防御 -->
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="TCP 连接耗尽攻击防御"
    >
      <template slot="tips">将连接数限制在阈值以内</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.tcpConnectProtectionSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="180px"
      >
        <el-form-item label="目的IP地址并发连接数阈值">
          <el-input-number
            v-model="adsSettings.tcpConnectThreshold"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >个（连接数阈值：0-10,000,000）</span>
        </el-form-item>
        <el-form-item label="目的IP新建连接速率阈值">
          <el-input-number
            v-model="adsSettings.tcpConnectPpsThreshold"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >个（连接数阈值：0-10,000,000）</span>
        </el-form-item>
        <el-form-item label="源IP并发连接限速">
          <el-input-number
            v-model="adsSettings.srcTcpConnectLimit"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >个（连接数阈值：0-10,000,000）</span>
        </el-form-item>
        <el-form-item label="源IP新建连接速率限速">
          <el-input-number
            v-model="adsSettings.srcTcpConnectPpsLimit"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >个（连接数阈值：0-10,000,000）</span>
        </el-form-item>
        <el-form-item label="目的IP并发连接限速">
          <el-input-number
            v-model="adsSettings.dstTcpConnectLimit"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >个（连接数阈值：0-10,000,000）</span>
        </el-form-item>
        <el-form-item label="目的IP新建连接速率限速">
          <el-input-number
            v-model="adsSettings.dstTcpConnectPpsLimit"
            :min="0"
            :max="10000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >个（连接数阈值：0-10,000,000）</span>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item>
          <el-checkbox v-model="adsSettings.srcConnectAutoForbidSwitch">源IP并发连接数异常黑名单</el-checkbox>
          <el-checkbox v-model="adsSettings.srcConnectPpsAutoForbidSwitch">源IP新建连接速率异常黑名单</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-input-number
            v-model="adsSettings.srcConnectPpsStatsTime"
            :min="0"
            :max="60"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >秒（范围：0-60）</span>
          <el-input-number
            v-model="adsSettings.srcConnectPpsMax"
            :min="0"
            :max="1000000"
            controls-position="right"
            label="描述文字"
          />
          <span
            class="color--text-regular"
            style="margin-left: 10px"
          >最大连接数（范围：0-1,000,000）</span>
        </el-form-item>
      </el-form>
    </CardItemForm>
  </div>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import adsMixins from '../../../mixins/ads'

export default {
  components: { SelectSwitch },

  mixins: [adsMixins],

  data() {
    return {
      selects: {
        ackProtectionAlg: [
          {
            label: '严格',
            value: 0
          },
          {
            label: '宽松',
            value: 1
          }
        ]
      },
      selectSynProtectionAlg: [
        {
          label: 'right-seq',
          value: 0
        },
        {
          label: 'error-seq',
          value: 1
        }
      ]
    }
  }
}
</script>
