import { configure } from "@storybook/vue"
import Vue from "vue";
import ElementUI from 'element-ui'

import '@/styles/index-story.scss'

Vue.use(ElementUI, {
  size: 'small'
})
import Form from '@/components/Form'
Vue.use(Form)

function loadStories() {
  // You can require as many stories as you need.
  require("../src/components/Column/__story__/ColumnDomain.story");
  require("../src/components/Dm/__story__/DmTable.story");

  require("../src/components/Input/__story__/InputArea.story");
  // require("../src/components/Input/__story__/InputMultiple.story");
  require("../src/components/Input/__story__/InputRuleLimit.story");
  require("../src/components/Input/__story__/InputSearch.story");
  require("../src/components/Input/__story__/InputSuffix.story");
  require("../src/components/Input/__story__/InputWeekTime.story");
}

configure(loadStories, module);
