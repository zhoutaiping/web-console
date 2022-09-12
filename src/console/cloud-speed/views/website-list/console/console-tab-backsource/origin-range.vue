<template>
  <yd-card
    horizontal
    title="Range 回源"
  >
    <template slot="tips">
      需要源站支持Range请求，开启后可以按块缓存，按需回源，提高缓存命中率和响应速度
    </template>
    <SelectSwitch
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="fetchUpdate()"
    />
    <yd-alert>
      <p>只对下面这些文件后缀名生效</p>
      <p>视频：AVI、MP4、RMVB、FLV、WMV、MOV、3GP、ASF、MPG、F4V、MKV、VOB、M3U8、TS、DAT、RM</p>
      <p>音频：MP3、OGG、M4A、WMA、AIF、AU</p>
      <p>安装包：APK、ZIP、EXE、RAR、IPA、PXL、DEB、SIS、JAR、XAP</p>
      <p>其他：SO、CUE、CCD、MDS、IMG、7Z、CAB、DHP、GZ、ISO、MPQ、PBCV、PXL、QNP、P00、XY、XY2</p>
    </yd-alert>
  </yd-card>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import panelMixins from '../panelMixins'

export default {
  name: 'OriginRange',

  components: { SelectSwitch },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'slice',
      formDefault: {
        status: 'off'
      }
    }
  }
}
</script>
