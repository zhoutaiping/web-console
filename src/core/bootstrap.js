import Vue from 'vue'
import store from '@/store'
import config from '@/core/setup-config'
import Fetch from '@/api/fetch'
import { labelView } from '@/utils/filter'
import { formatObjToList } from '@/utils/format'

export default async function Initializer() {
  const language = Vue.ls.get('language') || config.language
  store.commit('SET_LANGUAGE', language)
  try {
    await initAreaView()
  } catch (e) {
    //
  } finally {
    store.commit('SET_APP_READY')
  }
}

function formatOptions(item) {
  return {
    label: item.name,
    value: item.key
  }
}

async function initAreaView() {
  const { countrys, provinces, ipRegions } = await Fetch.get('V4/share_data.region')
  if (!countrys) return
  const list = [{
    value: 'CNPR',
    label: '中国大陆'
  }, {
    value: 'CNHMT',
    label: '港澳台'
  }]
  list.push(...formatObjToList(countrys))
  const chinaList = formatObjToList(provinces).map(_ => {
    return {
      label: _.label,
      value: _.value
    }
  })
  list.push(...chinaList)

  const selectRegion = {
    world: [],
    china: chinaList,
    list
  }

  const regionMap = {
    CNPR: new Set(Object.keys(provinces)),
    CNHMT: new Set(['HK', 'MO', 'TW'])
  }

  ipRegions.forEach(item => {
    list.push({
      label: item.name,
      value: item.key
    })
    regionMap[item.key] = new Set(item.child.map(_ => _.key))
    let options = item.child.map(_ => {
      list.push({
        label: _.name,
        value: _.key
      })
      let _options
      if (_.child) {
        regionMap[_.key] = new Set(_.child.map(_ => _.key))
        _options = _.child.map(formatOptions)
      }

      return {
        options: _options,
        value: _.key,
        label: _.name
      }
    })

    regionMap['CN'] = new Set(['CNPR', 'CNHMT'])
    // TODO
    if (item.key === 'CN') {
      options = [
        {
          label: '中国大陆',
          options: chinaList
        },
        {
          label: '港澳台',
          options
        }
      ]
    }

    selectRegion.world.push({
      label: item.name,
      value: item.key,
      options
    })
  })

  store.commit('SET_SELECT_REGION', selectRegion)
  store.commit('SET_SELECT_REGION_MAP', regionMap)

  function areaView(value) {
    return labelView(value, list)
  }

  Vue.filter('areaView', areaView)
}
