<style lang="scss">
.tableCdnCache {
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
    <yd-form-radio-button v-model="type" :radios="SELECT.CDN_CACHE_TYPE" class="button--cdnType">
      <i class="yun-icon ya-iconfont ya-yun-prior"/>
    </yd-form-radio-button>
    <slot name="action"/>
    <yd-table :open-min-height="false" style="margin-top: 12px" add-btn @add-row="handleAddRow">
      <el-table :data="listView">
        <el-table-column label="缓存类型" min-width="80">
          <template slot-scope="scope">
            <yd-form-select v-model="scope.row.type" :selects="type === 'yes' ? SELECT.CDN_RULES_TYPE : SELECT.CDN_RULES_TYPE_M2" @change="changeClearn(scope.row, 'content')"/>
          </template>
        </el-table-column>
        <el-table-column label="匹配内容">
          <template slot-scope="scope">
            <el-form :ref="`formContent-${scope.$index}`" :model="scope.row" :rules="formRules">
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
        </el-table-column>
        <el-table-column v-if="type === 'yes'" prop="" label="缓存方式" width="80">
          <template slot-scope="scope">
            {{ scope.row.cache_type | labelView(SELECT.CDN_CACHE_TYPE) }}
          </template>
        </el-table-column>
        <el-table-column v-if="type === 'yes'" label="缓存时间" width="190">
          <template slot-scope="scope">
            <el-form :ref="`formTime-${scope.$index}`" :model="scope.row" :rules="formRules">
              <el-form-item style="margin-bottom: 0px" prop="cache_time">
                <el-input v-model="scope.row.cache_time" style="width: 80px" placeholder="请填写"/>
                <yd-form-select v-model="scope.row.cache_time_unit" :selects="SELECT.CDN_CACHE_TIME" style="width: 80px" placeholder="请选择"/>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="80">
          <template slot-scope="scope">
            <ColumnAction>
              <el-button v-show="!scope.row.$edit" type="text" @click="handleRowDelete(scope)">删除</el-button>
            </ColumnAction>
          </template>
        </el-table-column>
      </el-table>
    </yd-table>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import PopupSuffix from '@/components/Popup/PopupSuffix'
import ColumnBtnSort from '@/components/Column/ColumnBtnSort'
import { deepClone } from '@/utils'
import diloagBatch from '../../../../mixins/dialog-batch'
import { validatorNumber, validator } from '@/utils/validator'
import RULE from '@/utils/verify'

const FORM_ROW = {
  type: 'suffix',
  content: '',
  cache_time_unit: 'minute',
  cache_time: '',
  cache_type: 'yes'
}

export default create({
  name: 'tableCdnCache',

  mixins: [diloagBatch],

  props: {
    loading: Boolean,
    data: [Array, Object]
  },

  data() {
    return {
      type: 'yes',
      list: [],
      policy: 'append',
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

  components: { PopupSuffix, ColumnBtnSort },

  computed: {
    listView() {
      return this.list.filter(_ => _.cache_type === this.type)
    }
  },

  methods: {
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

    handleAddRow() {
      const row = deepClone(FORM_ROW)
      row.cache_type = this.type
      this.list.push(row)
    },

    handleRowDelete(scope) {
      const { $index } = scope
      this.list.splice($index, 1)
    }
  }
})
</script>
