<template>
  <div :class="b()">
    <template v-if="scope.row.$edit">
      <ColumnForm
        ref="ColumnForm"
        :model="scope.row"
        :item-rules="rowRules[scope.row.type]"
        prop="value"
      >
        <el-input
          v-model="scope.row.value"
          placeholder="记录值"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </ColumnForm>
    </template>
    <template v-else>
      {{ scope.row.value }}
    </template>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import RULE from '@/utils/verify'
import ColumnForm from '@/components/Column/ColumnForm'

export default create({
  name: 'ColumnRecordValue',

  components: { ColumnForm },

  props: {
    scope: Object
  },

  data() {
    return {
      rowRules: {
        A: {
          pattern: RULE.ipReg, trigger: 'blur', message: '格式错误', required: true
        },
        CNAME: {
          validator(rule, value, callback) {
            if (!RULE.resolvingDomain.test(value) && !RULE.domainWithLastPoint.test(value)) {
              callback(new Error('格式错误'))
            } else {
              callback()
            }
          }
        },
        MX: {
          validator(rule, value, callback) {
            if (!RULE.domain.test(value) && !RULE.ipReg.test(value) && !RULE.domainWithLastPoint.test(value)) {
              callback(new Error('格式错误'))
            } else {
              callback()
            }
          }
        },
        NS: {
          validator(rule, value, callback) {
            if (!RULE.resolvingDomain.test(value) && !RULE.domainWithLastPoint.test(value)) {
              callback(new Error('格式错误'))
            } else {
              callback()
            }
          }
        },
        AAAA: {
          pattern: RULE.Ipv6Reg, trigger: 'blur', message: '格式错误', required: true
        }
      }
    }
  },

  methods: {
    validate() {
      return this.$refs.ColumnForm.validate()
    },

    handleBlur() {
      this.$emit('blur')
    },

    handleFocus() {
      this.$emit('focus')
    }
  }
})
</script>
