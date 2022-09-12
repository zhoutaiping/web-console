<style lang="scss">
.TableRuleGroup {
  &__btnSort {
    font-size: 14px;
    cursor: pointer;
    line-height: 32px;
  }
}
</style>

<template>
  <div :class="b()">
    <el-form
      v-for="(item, index) in data"
      v-if="item.logic === showLogic"
      :ref="`Form__${index}`"
      :key="index"
      :model="item"
      :rules="formRules"
      style="margin-bottom: 10px"
    >
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item prop="key">
            <SelectZeroRule
              v-model="item.key"
              :selects="selectRuleKeyView"
              @change="() => item.data = []"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-show="item.key"
          :span="10"
        >
          <template v-if="NOT_DATA.includes(item.key)">
            <!--  -->
          </template>
          <template v-else-if="item.key === 'api_tokens'">
            <yd-form-select
              :selects="selectApiToken"
              v-model="item.data"
              multiple
              style="width: 100%"
            />
          </template>
          <template v-else-if="item.key === 'group_uuid'">
            <yd-form-select
              :selects="selectAccessGroup"
              v-model="item.data"
              multiple
              style="width: 100%"
            />
          </template>
          <template v-else>
            <el-form-item
              :rules="itemDataRules(item.key, item.data)"
              prop="data"
            >
              <InputMultiple
                v-model="item.data"
                :placeholder="RULE_TIPS[item.key] ? RULE_TIPS[item.key] : labelView(item.key, selectRuleKey)"
              />
            </el-form-item>
          </template>
        </el-col>
        <el-col :span="1">
          <template
            v-if="showLogic === 'include' && index === 0">
            <!--  -->
          </template>
          <a
            v-else
            :class="
            b('btnSort')"
            class="el-icon-remove"
            @click="handleRowRemove(index)"
          />
        </el-col>
      </el-row>
    </el-form>
    <el-button
      type="text"
      @click="handleAdd"
    >+ 添加一条{{ groupTitle }}规则</el-button>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import InputMultiple from '@/components/Input/InputMultiple'
import { labelView } from '@/utils/filter'
import RULE from '@/utils/verify'
import { validatorList } from '@/utils/validator'
import SelectZeroRule from './SelectZeroRule'

function filterByDecision(list, decision) {
  return list.filter(item => {
    return item.decision ? item.decision.includes(decision) : true
  }).map(item => {
    item = Object.assign({}, item)
    if (item.children && item.children.length) {
      item.children = filterByDecision(item.children, decision)
    }
    return item
  })
}

function filterDisabled(list, disabled) {
  return list.map(item => {
    item.disabled = disabled.includes(item.value)
    item = Object.assign({}, item)
    if (item.children && item.children.length) {
      item.children = filterDisabled(item.children, disabled)
    }
    return item
  })
}

export default create({
  name: 'TableRuleGroup',

  components: { InputMultiple, SelectZeroRule },

  props: {
    data: Array,
    decision: String,
    showLogic: String,
    groupTitle: String,
    selectRuleKey: Array,
    selectAccessGroup: Array,
    selectApiToken: Array
  },

  computed: {
    selectedKeys() {
      const list = this.data.filter(_ => _.logic === this.showLogic).filter(Boolean)
      return list.map(_ => _.key)
    },

    selecteRuleItem() {
      const list = this.data.filter(_ => _.logic === this.showLogic).filter(Boolean)
      return list.map(_ => _.key)
    },

    selectRuleKeyView() {
      const selectedKeys = this.data.filter(_ => _.logic === this.showLogic).filter(Boolean).map(_ => _.key)
      this.selectRuleKey.forEach(_ => {
        if (_.children && _.children.length === 0) {
          delete _.children
        }
      })
      if (this.decision) {
        return filterDisabled(filterByDecision(this.selectRuleKey, this.decision), selectedKeys)
      } else {
        return this.selectRuleKey
      }
    },

    formIds() {
      const formIds = []
      this.data.forEach((item, index) => {
        if (item.logic === this.showLogic) formIds.push(index)
      })
      return formIds
    }
  },

  data() {
    return {
      labelView,
      NOT_DATA: ['everyone'],
      RULE_TIPS: {
        email: 'email@example.com',
        email_domain: 'domain.com',
        mobile: '13012341234',
        ip: 'IP v4/v6 地址和 CIDR',
        main_department_name: '财务部'
      },
      formRules: {
        key: {
          required: true,
          message: '请选择'
        }
      }
    }
  },

  methods: {
    itemDataRules(key) {
      let validator
      if (key === 'email') {
        validator = validatorList(RULE.EmailReg)
      }

      return {
        required: true,
        validator,
        message: ' ',
        trigger: 'blur'
      }
    },

    clearValidateItem(index) {
      this.$refs[`Form__${index}`] && this.$refs[`Form__${index}`][0].clearValidate()
    },

    itemValidate(index) {
      if (!this.$refs[`Form__${index}`] || !this.$refs[`Form__${index}`][0]) return
      this.$refs[`Form__${index}`][0].validate(valid => {
        if (!valid) throw new Error()
      })
    },

    handleItemKeyChange(form, index) {
      this.clearValidateItem(index)
      form.data = []
    },

    handleAdd() {
      this.formIds.length && this.itemValidate(this.formIds[this.formIds.length - 1])
      this.$emit('add')
    },

    handleRowRemove(index) {
      this.data.splice(index, 1)
    },

    async checkList() {
      for (const i of this.formIds) {
        try {
          await this.itemValidate(i)
        } catch (e) {
          throw new Error()
        }
      }
    }
  }
})
</script>
