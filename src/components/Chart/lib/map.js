import echarts from 'echarts/lib/echarts'
import { getMapJSON, getFormated } from './utils'

function getTooltip(dataType, digit, dataStore, metrics, color, labelMap, baseUnit) {
  return {
    formatter(params) {
      const { name, value, seriesName, marker, data } = params

      if (!data) return
      const values = value.toString().split('.')

      // TODO
      let val
      let parent
      if (values.length === 2) {
        val = values[0]
        parent = values[1].padEnd(4, '0') / 100
      } else {
        val = values[0]
        parent = '100.00'
      }

      let result = name + '<br />'
      const valueFormat = getFormated(val) + (baseUnit ? ` ${baseUnit}` : '')
      result += `<strong>${marker} ${seriesName}：${valueFormat} （${parent}%）</strong>`
      return result
      // const tpl = []
      // if (!item.name) return ''
      // tpl.push(`${item.name}<br>`)
      // metrics.forEach((label, index) => {
      //   const title = labelMap[label] != null ? labelMap[label] : label
      //   tpl.push(`${itemPoint(color[index])} ${title} : `)
      //   if (dataStore[item.name]) {
      //     tpl.push(getFormated(dataStore[item.name][label], dataType[label], digit))
      //   } else {
      //     tpl.push('-')
      //   }
      //   tpl.push('<br>')
      // })
      // return tpl.join(' ')
    }
  }
}

function getSeries(args) {
  const {
    position,
    selectData,
    dimension,
    metrics,
    rows,
    label,
    itemStyle,
    selectedMode,
    roam,
    center,
    aspectScale,
    boundingCoords,
    zoom,
    labelMap,
    scaleLimit,
    mapGrid
  } = args
  const result = []
  const mapBase = {
    type: 'map',
    mapType: position
  }

  metrics.forEach(itemName => {
    const itemResult = Object.assign({
      name: labelMap[itemName] != null ? labelMap[itemName] : itemName,
      data: [],
      selectedMode,
      roam,
      center,
      aspectScale,
      boundingCoords,
      zoom,
      scaleLimit
    }, mapBase)

    if (mapGrid) {
      Object.keys(mapGrid).forEach(key => {
        itemResult[key] = mapGrid[key]
      })
    }

    setGeoLabel(itemStyle, itemResult, 'itemStyle')
    setGeoLabel(label, itemResult, 'label')

    rows.forEach(row => {
      itemResult.data.push({
        name: row[dimension],
        value: row[itemName],
        selected: selectData
      })
    })
    result.push(itemResult)
  })

  return result
}

function setGeoLabel(value, target, label) {
  if (typeof value === 'object') {
    target[label] = value
  } else if (value) {
    target[label] = {
      normal: { show: true },
      emphasis: { show: true }
    }
  }
}

function getLegendMap(args) {
  const { metrics, legendName, labelMap } = args
  if (!legendName && !labelMap) return { data: metrics }
  const data = labelMap
    ? metrics.map(item => (labelMap[item] == null ? item : labelMap[item]))
    : metrics
  return {
    data,
    formatter(name) {
      return legendName[name] != null ? legendName[name] : name
    }
  }
}

function registerMap(args, mapOrigin) {
  const {
    _once,
    registerSign,
    beforeRegisterMap,
    beforeRegisterMapOnce,
    registerSignOnce,
    position,
    specialAreas
  } = args
  if (!_once[registerSign]) {
    if (beforeRegisterMap) mapOrigin = beforeRegisterMap(mapOrigin)
    if (beforeRegisterMapOnce && !_once[registerSignOnce]) {
      _once[registerSignOnce] = true
      mapOrigin = beforeRegisterMapOnce(mapOrigin)
    }
    _once[registerSign] = true
    echarts.registerMap(position, mapOrigin, specialAreas)
  }
}

export const map = (columns, rows, settings = {}, extra = {}) => {
  const {
    position = 'china',
    selectData = false,
    selectedMode,
    label = true,
    dataType = {},
    digit = 2,
    dimension = columns[0],
    roam,
    center,
    aspectScale,
    boundingCoords,
    zoom,
    scaleLimit,
    legendName = {},
    labelMap = {},
    mapGrid,
    itemStyle,
    positionJsonLink,
    beforeRegisterMap,
    beforeRegisterMapOnce,
    mapURLProfix = 'https://unpkg.com/echarts@3.6.2/map/json/',
    specialAreas = {},
    legendVisible,
    baseUnit
  } = settings
  const mapOrigin = settings.mapOrigin
  let metrics = columns.slice()
  if (settings.metrics) {
    metrics = settings.metrics
  } else {
    metrics.splice(columns.indexOf(dimension), 1)
  }
  const { tooltipVisible, color, _once = {}} = extra
  const dataStore = {}
  rows.forEach(row => { dataStore[row[dimension]] = row })
  const tooltip = tooltipVisible && getTooltip(dataType, digit, dataStore, metrics, color, labelMap, baseUnit)
  const legend = legendVisible && getLegendMap({ metrics, legendName, labelMap })
  const seriesParams = {
    position,
    selectData,
    label,
    itemStyle,
    dimension,
    metrics,
    rows,
    selectedMode,
    roam,
    center,
    aspectScale,
    boundingCoords,
    zoom,
    labelMap,
    scaleLimit,
    mapGrid
  }
  const series = getSeries(seriesParams)
  const registerOptions = {
    _once,
    beforeRegisterMap,
    beforeRegisterMapOnce,
    registerSign: `MAP_REGISTER_${position}`,
    registerSignOnce: `ONCE_MAP_REGISTER_${position}`,
    position,
    specialAreas
  }
  if (mapOrigin) {
    registerMap(registerOptions, mapOrigin)
    return { series, tooltip, legend }
  } else {
    return getMapJSON({
      position,
      positionJsonLink,
      beforeRegisterMapOnce,
      mapURLProfix
    }).then(json => {
      registerMap(registerOptions, json)
      return { series, tooltip, legend }
    })
  }
}
