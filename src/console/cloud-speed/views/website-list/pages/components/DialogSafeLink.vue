<style lang="scss">
.dialogSafeLink {
  .add-btn-in {
    margin-top: 8px;
    margin-left: 0px !important;
  }
}
</style>

<template>
  <yd-dialog v-loading :class="b()" :title="title" :visible.sync="open" :close-on-click-modal="true" aside aside-type="top">
    <div>
      <FormItemAction>
        保护网站资源不被外部盗用
        <yd-form-select slot="action" v-model="form.status" :selects="addReserved(SELECT.SWITCH_M2)"/>
      </FormItemAction>

      <template v-if="form.status !== '__KEEP__'">
        <el-form style="margin-top: 12px" label-position="left" label-width="120px">
          <el-form-item label="防盗链黑白名单">
            <yd-form-radio v-model="form.mode" :radios="addReserved(SELECT_OP, 'keep')"/>
          </el-form-item>
          <template v-if="form.mode !== 'keep'">
            <el-form-item label="添加方式">
              <yd-form-radio v-model="form._pmode" :radios="SELECT.EDIT_TYPE_M2"/>
            </el-form-item>
            <el-form-item>
              <input-edit v-if="form.mode === `blackList`" :list-data="form.blackList" valid-type="domain" @updateItem="antiReferBlackItem"/>
              <input-edit v-if="form.mode === `whiteList`" :list-data="form.whiteList" valid-type="domain" @updateItem="antiReferWhiteItem"/>
            </el-form-item>
          </template>
        </el-form>
      </template>
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
import InputEdit from '@/components/InputEdit/input-edit'

const SELECT_OP = [
  {
    label: '白名单模式',
    value: 'whiteList'
  },
  {
    label: '黑名单模式',
    value: 'blackList'
  }
]

const FORM = {
  status: '__KEEP__',
  mode: 'keep',
  _pmode: 'append',
  blackList: [],
  whiteList: []
}

export default create({
  name: 'dialogSafeLink',

  mixins: [diloagBatch],

  components: { FormItemAction, InputEdit },

  data() {
    return {
      title: '防盗链',
      open: false,
      loadingSubmit: false,
      SELECT_OP,
      form: {
        mode: '',
        blackList: [],
        whiteList: []
      }
    }
  },

  methods: {
    handleOpen() {
      this.form = deepClone(FORM)
      this.open = true
    },

    handleClose() {
      this.open = false
    },

    antiReferBlackItem(listDate) {
      this.form.blackList = listDate
    },

    antiReferWhiteItem(listDate) {
      this.form.whiteList = listDate
    },

    handleSubmit() {
      const form = deepClone(this.form)
      if (form.status === '__KEEP__') {
        this.handleClose()
        return
      }
      form._policy = form.status

      const data = {
        id: 'anti_refer',
        name: 'dialogSafeLink',
        form
      }
      this.$emit('submit', data)
    }
  }
})
</script>
