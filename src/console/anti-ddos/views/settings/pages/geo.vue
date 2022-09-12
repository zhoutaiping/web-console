<template>
  <div>
    <CardItemForm
      :loading="false"
      is-init
      is-support
      title="GeoIP防护"
    >
      <template slot="tips">针对源IP进行访问控制，按区域进行配置</template>
      <SelectSwitch
        slot="action"
        v-model="adsSettings.geoIpFilterSwitch"
        @change="adsFetchSaveSettings"
      />
      <el-form
        label-position="left"
        label-width="150px"
      >
        <el-form-item label="禁止访问区域">
          <InputArea :province="false" v-model="adsSettings.geoIpCountryIdPrimary" />
        </el-form-item>
      </el-form>
    </CardItemForm>
  </div>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import adsMixins from '../../../mixins/ads'
import InputArea from '@/components/Input/InputArea'

export default {
  components: { SelectSwitch, InputArea },

  mixins: [adsMixins]
}
</script>
