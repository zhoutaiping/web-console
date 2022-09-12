<template>
  <yd-card
    horizontal
    title="关键词监控"
  >
    <template slot="tips">
      <p>实时监测网站中的关键词是否缺失</p>
    </template>
    <yd-form-select
      slot="action"
      :selects="Label.status"
      v-model="form.keyword"
      @change="handleUpdate"
    />
    <TableKeyword
      ref="TableKeyword"
      :start-url="startUrl"
      @change="handleUpdateTableKeyword"
    />
  </yd-card>
</template>

<script>
import TableKeyword from './components/TableKeyword'
import mixins from './mixins'

export default {
  components: { TableKeyword },

  mixins: [mixins],

  data() {
    return {
      SETTING_GROUP: 'keyword',
      Label: {
        status: [
          {
            label: 'OFF',
            value: false
          },
          {
            label: 'ON',
            value: true
          }
        ]
      },
      startUrl: ''
    }
  },

  methods: {
    init(data) {
      const form = {
        detection_id: data.detection_id,
        keyword: data.keyword
      }

      const keywordList = data.keywordList || []
      this.$refs.TableKeyword.setList(keywordList)
      this.form = form
      this.startUrl = data.startUrl
    },

    async handleUpdateTableKeyword() {
      const keywordList = await this.$refs.TableKeyword.getList()
      this.handleUpdate({
        keywordList
      })
    }
  }
}
</script>
