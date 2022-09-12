<style lang="scss">
</style>

<template>
  <div :class="b()">
    <template v-if="scope.row.$edit">
      <ColumnForm
        ref="ColumnForm"
        :model="scope.row"
        :rules="rowRules"
        prop="name"
      >
        <el-input
          v-model="scope.row.name"
          placeholder="主机记录"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </ColumnForm>
    </template>
    <template v-else>
      {{ scope.row.name }}
    </template>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import ColumnForm from '@/components/Column/ColumnForm'

export default create({
  name: 'ColumnRecordName',

  components: { ColumnForm },

  props: {
    scope: Object
  },

  data() {
    return {
      rowRules: {
        name: {
          validator(rule, value, callback) {
            if (value.indexOf('-') === 0 || value.indexOf('-') === value.length - 1) {
              callback(new Error('格式错误'))
            } else if (value.indexOf('.') === 0 || value.indexOf('.') === value.length - 1) {
              callback(new Error('格式错误'))
            } else if (value.indexOf('@') >= 0) {
              if (value.length > 1) {
                callback(new Error('格式错误'))
              }
            } else if (value.indexOf('*') >= 0) {
              const nameArr = value.split('')
              nameArr.forEach((value, index) => {
                if (value === '*') {
                  if (index !== 0) callback(new Error('格式错误'))
                  if (nameArr[index + 1] !== '.' && nameArr[index + 1] !== undefined) {
                    callback(new Error('格式错误'))
                  }
                }
              })
            } else if (value.length > 63) {
              callback(new Error('格式错误'))
            }
            callback()
          },
          trigger: 'blur'
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
