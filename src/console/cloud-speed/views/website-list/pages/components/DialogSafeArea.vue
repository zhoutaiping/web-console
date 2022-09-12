<style lang="scss" scoped>
.area {
  &-list-wrap {
    max-width: 650px;
  }
  &-item {
    width: 200px;
    display: inline-block;
    &__btn {
      cursor: pointer;
      color: #ddd;
      margin-right: 8px;
      &:hover {
        color: $--color-primary;
      }
    }
  }
}
</style>

<template>
  <yd-dialog v-loading :class="b()" :title="title" :visible.sync="open" :close-on-click-modal="true" aside aside-type="top">
    <div>
      <FormItemAction>
        可根据业务需求，允许或禁止特定去的终端用户对网站资源的访问
        <yd-form-select slot="action" v-model="form.status" :selects="addReserved(SELECT.SWITCH_M2, 'keep')"/>
      </FormItemAction>
      <el-form style="margin-top: 12px" label-width="120px">
        <el-form-item label="屏蔽模式">
          <yd-form-radio v-model="form.mode" :radios="addReserved(SELECT.BLACK_WB_LIST, 'keep')"/>
        </el-form-item>

        <template v-if="form.mode !== 'keep'">
          <el-form-item label="添加区域">
            <div style="margin-bottom: 12px">
              <yd-form-radio v-model="form._pmode" :radios="SELECT.EDIT_TYPE_M2"/>
            </div>
            <el-select v-model="formZone.country" style="width: 140px" placeholder="请选择">
              <el-option v-for="item in CountryList" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-select v-if="formZone.country === 'CN'" v-model="formZone.province" style="width: 140px" placeholder="请选择">
              <el-option v-for="item in ProvinceList" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-button type="primary" @click="handleItemAdd">添加</el-button>

          </el-form-item>
          <el-form-item label="">
            <div class="area-list-wrap">
              <div v-for="(item, index) in list" :key="index" class="area-item">
                <i class="area-item__btn el-icon-circle-close" @click="handleItemRemove(index)"/>
                <span class="area-item__text">{{ item | areaView }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="访问控制时间">
            <yd-form-radio :radios="SELECT_TIME_OP" v-model="showTime"/>
          </el-form-item>
          <el-form-item v-show="showTime === 'rewrite'" label="星期">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" class="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedWeeks" class="week" @change="handleCheckedWeeksChange">
              <el-checkbox v-for="week in weeks" :label="week.value" :key="week.value">{{ week.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-show="showTime === 'rewrite'" label="时间">
            <el-time-picker v-model="startValue" value-format="HH:mm" placeholder="--|--" @change="setStartTime"/>
            <el-time-picker v-model="endValue" value-format="HH:mm" placeholder="--|--" @change="setEndTime"/>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="handleClose">取消</el-button>
      <el-button :loading="loadingSubmit" type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </yd-dialog>
</template>

<script>
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
import FormItemAction from '@/components/FormItem/FormItemAction'
import diloagBatch from '../../../../mixins/dialog-batch'
import CountryList from '@/constants/country-list'
import { province as ProvinceList } from '@/constants/city-data'

const SELECT_TIME_OP = [
  {
    label: '保留原时间配置',
    value: 'keep'
  },
  {
    label: '修改访问时间配置',
    value: 'rewrite'
  }
]

const FORM = {
  status: 'keep',
  mode: 'keep',
  _pmode: 'append'
}

const FORM_ZONE = {
  country: 'CN',
  province: ''
}

const weekOptions = [
  {
    label: '星期一',
    value: '1'
  },
  {
    label: '星期二',
    value: '2'
  },
  {
    label: '星期三',
    value: '3'
  },
  {
    label: '星期四',
    value: '4'
  },
  {
    label: '星期五',
    value: '5'
  },
  {
    label: '星期六',
    value: '6'
  },
  {
    label: '星期日',
    value: '0'
  }
]

export default create({
  name: 'dialogSafeArea',

  mixins: [diloagBatch],

  components: { FormItemAction },

  data() {
    return {
      SELECT_TIME_OP,
      title: '区域屏蔽',
      open: false,
      loadingSubmit: false,
      form: deepClone(FORM),
      formZone: deepClone(FORM_ZONE),
      showTime: 'keep',
      CountryList,
      ProvinceList,

      list: [],

      checkAll: true,
      checkedWeeks: [],
      weeks: weekOptions,
      checkedMapWeeks: ['0', '1', '2', '3', '4', '5', '6'],
      isIndeterminate: false, // select time
      startValue: new Date(2017, 6, 1, 0, 0),
      endValue: new Date(2017, 6, 1, 23, 59),
      startTime: '00:00',
      endTime: '23:59'
    }
  },

  methods: {
    handleOpen() {
      this.form = deepClone(FORM)
      this.formZone = deepClone(FORM_ZONE)
      this.list = []
      this.showTime = 'keep'
      this.checkedWeeks = []
      this.isIndeterminate = false

      this.open = true
    },

    handleClose() {
      this.open = false
    },

    handleItemAdd() {
      const { country, province } = this.formZone

      let item = country
      if (country === 'CN' && province) item += '-' + province
      this.list.push(item)
    },

    handleCheckAllChange(event) {
      this.checkedWeeks = event.target.checked ? this.checkedMapWeeks : []
      this.isIndeterminate = false
    },

    handleCheckedWeeksChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.weeks.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.weeks.length
    },

    handleItemRemove(index) {
      this.list.splice(index, 1)
    },

    setStartTime(value) {
      this.startTime = value
    },
    setEndTime(value) {
      this.endTime = value
    },

    checkTime() {
      let message = ''
      // check week
      if (this.showTime === 'rewrite' && !this.checkedWeeks.length) {
        message = '请至少选择一个确定的星期'
        this.$message.error(message)
        return false
      }

      const mapStartTime = Number(this.startTime.split(':').join(''))
      const mapEndTime = Number(this.endTime.split(':').join(''))
      if (mapStartTime >= mapEndTime) {
        message = '结束时间需要大于起始时间，请重新填写'
        this.$message.error(message)
        return false
      }
      return true
    },

    handleSubmit() {
      if (!this.checkTime()) return

      const form = deepClone(this.form)

      form._policy = form.status
      form.time_control_flag = this.showTime === 'rewrite' ? 1 : 'keep'

      // 屏蔽模式为修改
      if (form.mode !== 'keep') {
        // 构建区域列表
        const areaList = []
        this.list.forEach(item => {
          const [country_code, province_code = ''] = item.split('-')
          const area = {
            zone_code: {
              country_code,
              province_code
            }
          }
          areaList.push(area)
        })
        form[form.mode] = areaList

        if (this.showTime === 'rewrite') {
          form.time_control = {
            weeks: this.checkedWeeks,
            startTime: this.startTime,
            endTime: this.endTime
          }
        }
      }

      const data = {
        id: 'zone_limit',
        name: 'dialogSafeArea',
        form
      }
      this.$emit('submit', data)
    }
  }
})
</script>
