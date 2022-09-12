<template>
  <div>
    <el-form-item label="处置方式">
      <el-radio-group v-model="form.action">
        <el-radio
          v-for="item in CLOUD_WALL.HANDLE_TYPE"
          :key="item.value"
          :label="item.value"
        >{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 通用 -->
    <el-form-item v-if="form.action === CLOUD_WALL.HANDLE_TYPE_VAR.GENERAL_CC">
      <el-select
        v-model="form.level"
        style="width:150px"
        placeholder="请选择"
      >
        <el-option
          v-for="item in CLOUD_WALL.HANDLE_GENERAL_CC"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <!-- 封禁 -->
    <el-form-item v-if="form.action === CLOUD_WALL.HANDLE_TYPE_VAR.BLOCK">
      <el-form-item
        v-if="form.time_unit === 'second' || form.time_unit === 'minute'"
        :rules="FORM.FORM_POLICY_RULE.intval"
        prop="intval"
        style="display: inline-block; width: 150px;"
      >
        <el-input
          v-model="form.intval"
          placeholder="1 - 3600"
        />
      </el-form-item>
      <el-form-item
        v-if="form.time_unit === 'hour'"
        :rules="FORM.FORM_POLICY_RULE.intvalHour"
        prop="intval"
        style="display: inline-block; width: 150px;"
      >
        <el-input
          v-model="form.intval"
          placeholder="1 - 150"
        />
      </el-form-item>
      <el-form-item
        v-if="form.time_unit === 'day'"
        :rules="FORM.FORM_POLICY_RULE.intvalDay"
        prop="intval"
        style="display: inline-block; width: 150px;"
      >
        <el-input
          v-model="form.intval"
          placeholder="1 - 7"
        />
      </el-form-item>
      <el-select
        v-model="form.time_unit"
        style="width:100px"
        placeholder="请选择"
        @change="form.intval = ''"
      >
        <el-option
          v-for="item in CLOUD_WALL.TIME_TYPE"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <!-- 放行 -->
    <el-form-item v-if="form.action === CLOUD_WALL.HANDLE_TYPE_VAR.RELEASE">
      <span>放行后继续执行</span>
      <span>
        <el-checkbox-group v-model="form.release">
          <el-checkbox
            v-for="item in CLOUD_WALL.HANDLE_RELEASE"
            :label="item.value"
            :key="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </span>
    </el-form-item>
  </div>
</template>

<script>
import * as CLOUD_WALL from '@/constants/cloud-wall'
import * as FORM from '../../constants/form'

export default {
  props: {
    form: Object
  },

  data() {
    return {
      FORM,
      CLOUD_WALL
    }
  }
}
</script>
