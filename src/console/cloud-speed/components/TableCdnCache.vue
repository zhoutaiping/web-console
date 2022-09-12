<style lang="scss">
.TableCdnCache {
  .button {
    &--cdnType {
      margin-bottom: 12px;
      .el-radio-button__inner {
        width: 75px;
      }

      .ya-yun-prior {
        color: $--color-danger;
        position: relative;
        left: -18px;
        top: -10px;
      }
    }
  }
}
</style>

<template>
  <div :class="b()">
    <yd-form-radio-button
      v-model="type"
      :radios="SELECT.CDN_CACHE_TYPE"
      class="button--cdnType"
      style="vertical-align: top;"
      @change="handleChangeType"
    >
      <i class="yun-icon ya-iconfont ya-yun-prior" />
    </yd-form-radio-button>
    <el-button @click="handleAddRow">新增</el-button>
    <slot name="action" />
    <DmTable
      :loading="loading"
      border
    >
      <el-table :data="list">
        <el-table-column
          label="缓存类型"
          min-width="120"
        >
          <template slot-scope="scope">
            <yd-form-select
              v-if="scope.row.$edit"
              v-model="scope.row.type"
              :selects="type === 'yes' ? SELECT.CDN_RULES_TYPE : SELECT.CDN_RULES_TYPE_M2"
              @change="changeClearn(scope.row, 'content')"
            />
            <span v-else>{{ scope.row.type | labelView(SELECT.CDN_RULES_TYPE) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="匹配内容"
          min-width="250"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.$edit">
              <el-form
                :ref="`formContent-${scope.$index}`"
                :model="scope.row"
                :rules="formRules"
              >
                <template v-if="scope.row.type === 'suffix'">
                  <el-form-item
                    :rules="formRules.suffix"
                    class="hide-error"
                    prop="content"
                    style="margin-bottom: 0"
                  >
                    <el-popover
                      placement="bottom"
                      width="580"
                      trigger="click"
                    >
                      <PopupSuffix v-model="scope.row.content" />
                      <el-input
                        slot="reference"
                        v-model="scope.row.content"
                        placeholder="jpg|png|gif"
                      />
                    </el-popover>
                  </el-form-item>
                </template>
                <template v-if="['equal', 'dir', 'match'].includes(scope.row.type)">
                  <el-form-item
                    :rules="formRules.content"
                    class="hide-error"
                    prop="content"
                    style="margin-bottom: 0"
                  >
                    <el-input
                      v-model="scope.row.content"
                      placeholder="以 / 开头"
                    />
                  </el-form-item>
                </template>
                <template v-if="scope.row.type === 'tourist'">
                  <el-form-item
                    :rules="formRules.tourist"
                    class="hide-error"
                    prop="content"
                    style="margin-bottom: 0"
                  >
                    <el-input
                      v-model="scope.row.content"
                      placeholder="多个 cookie 名以“|”分割"
                    />
                  </el-form-item>
                </template>
              </el-form>
            </template>
            <template v-else>{{ scope.row.content }}</template>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type === 'yes'"
          label="缓存时间"
          min-width="165"
        >
          <template slot-scope="scope">
            <el-form
              v-if="scope.row.$edit"
              :ref="`formTime-${scope.$index}`"
              :model="scope.row"
              :rules="formRules"
            >
              <el-form-item
                style="margin-bottom: 0px"
                prop="cache_time"
              >
                <el-input
                  v-model="scope.row.cache_time"
                  style="width: 80px"
                  placeholder="请填写"
                />
                <yd-form-select
                  v-model="scope.row.cache_time_unit"
                  :selects="SELECT.CDN_CACHE_TIME"
                  style="width: 80px"
                  placeholder="请选择"
                />
              </el-form-item>
            </el-form>
            <template v-else>
              {{ scope.row.cache_time }}
              {{ scope.row.cache_time_unit | labelView(SELECT.CDN_CACHE_TIME) }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="优先级（由上往下)"
          min-width="140"
        >
          <template slot-scope="scope">
            <ColumnBtnSort
              @on-up="handleEmit('on-up', scope)"
              @on-down="handleEmit('on-down', scope)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="right"
          width="120"
        >
          <template slot-scope="scope">
            <ColumnAction>
              <template v-if="scope.row.$edit">
                <el-button
                  type="text"
                  @click="handleSaveRow(scope)"
                >保存</el-button>
                <el-button
                  type="text"
                  @click="handleCancelRow(scope)"
                >取消</el-button>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  @click="handleEditRow(scope)"
                >编辑</el-button>
                <PopoverConfirm
                  content="确认删除？"
                  @submit="handleDeleteRow(scope)"
                >
                  <el-button type="text">删除</el-button>
                </PopoverConfirm>
              </template>
            </ColumnAction>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import { deepClone } from '@/utils'
import RULE from '@/utils/verify'
import PopupSuffix from '@/components/Popup/PopupSuffix'
import ColumnBtnSort from '@/components/Column/ColumnBtnSort'
import { validatorNumber, validator } from '@/utils/validator'
import SELECT from '../constant/select'

const FORM_ROW = {
  type: 'suffix',
  content: '',
  cache_time_unit: 'minute',
  cache_time: '1',
  cache_type: 'yes'
}

export default create({
  name: 'TableCdnCache',

  components: { PopupSuffix, ColumnBtnSort },

  props: {
    loading: Boolean,
    list: [Array, Object]
  },

  data() {
    return {
      type: 'yes',
      SELECT,
      formRules: {
        cache_time: [
          {
            validator: validatorNumber(1, 999), trigger: 'blur', message: ' '
          }
        ],
        suffix: [
          { required: true, trigger: 'blur', message: '请填写' }
        ],
        tourist: [
          { required: true, trigger: 'blur', message: '请填写' }
        ],
        content: [
          { required: true, trigger: 'blur', message: '请填写' },
          { validator: validator(RULE.slashBegin), message: ' ' }
        ]
      }
    }
  },

  methods: {
    handleChangeType(type) {
      this.$emit('change-type', type)
    },

    handleInit() {
      this.list = []
    },

    changeClearn(to, key) {
      to[key] = ''
    },

    checkItem(index) {
      try {
        // 验证匹配目标
        this.$refs[`formContent-${index}`].validate(valid => {
          if (!valid) throw new Error()
        })

        if (this.type === 'yes') {
          this.$refs[`formTime-${index}`].validate(valid => {
            if (!valid) throw new Error()
          })
        }
      } catch (e) {
        return false
      }
      return true
    },

    async handleCheck() {
      const list = this.list
      for (let i = 0; i < list.length; i++) {
        const ret = await this.checkItem(i)
        if (!ret) throw new Error()
      }
    },

    handleEditRow(scope) {
      scope.row.$edit = true
      scope.row.$cache = deepClone(scope.row)
    },

    handleCancelRow(scope) {
      if (scope.row.id && scope.row.$cache) {
        scope.row.type = scope.row.$cache.type
        scope.row.content = scope.row.$cache.content
        scope.row.cache_type = scope.row.$cache.cache_type
        scope.row.cache_time_unit = scope.row.$cache.cache_time_unit
        scope.row.cache_time = scope.row.$cache.cache_time
        scope.row.$edit = false
      } else {
        this.list.splice(scope.$index, 1)
      }
    },

    isEditing(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].$edit) {
          return true
        }
      }
    },

    handleAddRow() {
      if (this.isEditing(this.list)) return
      const row = deepClone(FORM_ROW)
      row.cache_type = this.type
      row.$edit = true
      this.list.unshift(row)
    },

    handleEmit(event, scope) {
      this.$emit(event, scope)
    },

    handleSaveRow(scope) {
      if (this.checkItem(scope.$index)) {
        this.$emit('save-row', scope)
      }
    },

    handleDeleteRow(scope) {
      this.$emit('delete-row', scope)
    }
  }
})
</script>
